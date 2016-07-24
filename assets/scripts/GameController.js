/*
written by Jacob Sobolev

the main algorithm script controls the logic and the animations
need to put it on list on empty node and initialize the properties


*/


cc.Class({
    extends: cc.Component,

    properties: {
        gameSize: 3,
        tilePrefab: cc.Prefab,
        tileMoveSpeed: 0.05,
        debugLabel: cc.Label,
        scrollNode: cc.Node,
        openedLabel: cc.Label,
        closedLabel: cc.Label,
        uiController: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.scrollNode = this.scrollNode.getComponent('ListViewController');
        this.uiController = this.uiController.getComponent('UiController');
        this.initGameBoards();
         
    },

    // called every frame, uncomment this function to activate update callback
    //locks the update function calculates the next move, move the tile and releases the lock
    update: function (dt) {
        
        if (this.runningAi && !this.waitNext){
            this.waitNext = true;
            
            this.pickNextMove();
            this.openedLabel.string = "opened nodes: " + this.openedNodes.length.toString();
            this.closedLabel.string = "closed nodes: " + this.closedNodes.length.toString();
            // this.waitNext = false;
        }
        else if (this.shuffling && !this.waitNext){
            this.waitNext = true;
            this.shuffleNext();
        }
    },
    
    start: function () {
        this.initGraphicBoard();
        // this.scrollNode.addItem('item1');
        this.uiController.initLblShuffles(this.numOfShuffles);
        this.openedLabel.string = "opened nodes: 0" ;
        this.closedLabel.string = "closed nodes: 0" ;
        
    },
    
    //initialize the logic board, all the arrays and other local variables
    initGameBoards: function(){
        this.gameArrCurrent = [];
        
        var count = 1;
        for (var i = 0; i < this.gameSize; i++) {
            for (var j = 0; j < this.gameSize; j++) {
                this.gameArrCurrent.push(count);
                count ++;
            }
        }
        this.gameArrCurrent[count-2] = 0;
        this.gameArrGoal = this.gameArrCurrent.slice(0);
       
        this.shuffling = false;
        this.numOfShuffles = Math.pow(this.gameSize,2 )* 2;
        
        
        
        this.openedNodes = [];
        this.closedNodes = [];
        this.path = [];
        
        
        this.flag = false;
        this.runningAi = false;
        this.waitNext = false;
        
        this.forword = true;
        this.reverse = false;
        this.downPathArr = [];
        this.commanP = null;
        
        // this.funcToUse = this.octileDistanceHeuristic; 
        // this.funcToUse = this.euclideanHeuristic;
        this.funcToUse = this.manhattanHeuristic;
        this.heuristicIndex = 0;
        this.heuristicsNum = 3;
        this.id = 1;
         
        this.tile0Index = this.gameSize*this.gameSize - 1;
        
        this.tileMoveSpeedInc = this.tileMoveSpeed;
        this.tileMinMoveSpeed = this.tileMoveSpeed;
        
        this.runMode = 1;
        
        this.ShufflingIndex = 0;
        
        
    },
    

    //creates the tiles based on the game size variable and used the tile prefab
    initGraphicBoard: function(){
        var tmpNode = cc.instantiate(this.tilePrefab);
        var offSetX = 0;
        var offSetY = 0;

        if ( this.gameSize % 2 === 0 ){
            offSetY =  -tmpNode.height/2 ;
            offSetX =  tmpNode.width/2;
            
        }
        else{
            offSetY =  -tmpNode.height ;
            // offSetX =  -tmpNode.width /2;
            
        }
        
        //calc the start and the end of the indexs
        var start = Math.ceil( -this.gameSize / 2 );
        var end = Math.ceil( this.gameSize / 2 );
        
        var count = 0;
        tmpNode.destroy();
    
        // spawning the prefabs
        for ( var i = end; i > start; i-- ) {
            for ( var j = start; j < end; j++ ) {
                tmpNode = cc.instantiate(this.tilePrefab);
                tmpNode.parent = this.node;
                tmpNode.setPosition( j * tmpNode.width + offSetX, i* tmpNode.height + offSetY );
                var tmpChildLabel = tmpNode.getComponentInChildren( cc.Label );

                tmpNode.name = 'tile' + this.gameArrCurrent[count];  
                tmpChildLabel.string = this.gameArrCurrent[count];
                count ++;
                
            }
        }
    },
    
    //returns the avaliable moves of the logic board as the index to the array
    // example: the array [1,2,3,0] will return indexs 1,2 as avaliable moves
    //only the 0 tile can move on the board for each size as long as it exists
    getAvaliableIndexMoves: function(logicBoard){
        var moves = [];
        var indexS;
        for (var i = 0; i < logicBoard.length; i++) {
            if (logicBoard[i] === 0){
                indexS = i;
            }
        }
        //the source index
        var iCellS = Math.floor( indexS / this.gameSize );
        var jCellS = indexS % this.gameSize ;
        var indexDes;
    
        //check left side
        if (jCellS - 1>= 0 && jCellS - 1<= this.gameSize-1){
            indexDes = (iCellS * this.gameSize) + (jCellS-1);
            moves.push(indexDes);
    
        }
        //check right side
        if (jCellS + 1>= 0 && jCellS + 1<= this.gameSize-1){
          
            indexDes = (iCellS * this.gameSize) + (jCellS + 1);
            moves.push(indexDes);
          
        }
        //check top side
        if (iCellS - 1>= 0 && iCellS - 1<= this.gameSize-1){
          
            indexDes = ((iCellS-1) * this.gameSize) + jCellS;
            moves.push(indexDes);

        }
        //check bottom side
        if (iCellS + 1>= 0 && iCellS + 1<= this.gameSize-1){
            indexDes = ((iCellS+1) * this.gameSize) + jCellS;
            moves.push(indexDes);
        }
        return moves;
    },
    
    //exchanges the array which was returned from getAvaliableIndexMoves
    //to a complete logic board
    getAvaliableBoardMoves: function(movesIndexArr){
        var BoardMoves = [];
        for (var i = 0; i < movesIndexArr.length; i++) {
            var tmpBoard = this.gameArrCurrent.slice(0);
            this.updateBoard(tmpBoard, this.tile0Index, movesIndexArr[i]);
            BoardMoves.push(tmpBoard);
        }
        
        return BoardMoves;
    },
    
    //updates the board by spawning the src with des
    updateBoard: function(board,srcIndex,desIndex){
        var tmp;
        tmp = board[desIndex];
        board[desIndex] = 0;
        board[this.tile0Index] = tmp;
    },
    
    //tweens the tile0 to the destination's index tile position
    tweenTiles: function(des){
        var childSrc = this.node.getChildByName('tile0');
        // cc.log(childSrc.name);
        var desTileNum = this.gameArrCurrent[des];
        var childDes = this.node.getChildByName('tile'+desTileNum);
        //  cc.log(childDes.name);
        
        var srcAction = cc.moveTo(this.tileMoveSpeed, cc.p(childDes.x, childDes.y));
        childSrc.runAction(srcAction);
        
        var desAction = cc.moveTo(this.tileMoveSpeed, cc.p(childSrc.x, childSrc.y));
        childDes.runAction(desAction);
    },
    
    //shuffle the board changes the variable shuffling to true
    //the actual suffling is done at the update function
    shuffleBaord: function(){
        if (this.shuffling === false){
            // cc.log("shuffling");
            this.debugLabel.string = "shuffling";
            this.id = 1;
            this.openedNodes = [];
            this.closedNodes = [];
            this.path = [];
            this.shuffling = true;
            this.shufflingIndex = 0;
        }
    },
    
    
    //called from the update function numOfShuffles times,
    //the function get the avaliable moves picks random move and tweens the tiles and updates
    //the logic board, at the end the algorithm calculates the heuristic and pushes
    //the node the the openedNodes ready to run the algorithm
    shuffleNext: function(){
        if (this.shufflingIndex === this.numOfShuffles +1){
            var heuristicCurrent = this.funcToUse(this.gameArrCurrent,this.gameArrGoal);
            this.openedNodes.push(
                {   board:this.gameArrCurrent.slice(0),
                    heuristic: heuristicCurrent,
                    height: 0,
                    _id : this.id,
                    _parent: null,
                    _srcTile: -1,
                    _desTile: -1
                }
            );
            this.path.push(this.openedNodes[0]);
            
            this.id ++;
            this.debugLabel.string = "done shuffling";
            this.runMode = 3;
            this.uiController.changeBtnRunMode(this.runMode);  
            
            this.scheduleOnce(function() { 
                this.shuffling = false;
                this.waitNext = false;
                
            }, this.tileMoveSpeed*2); 
            
        }
        else{
            
            var moves = this.getAvaliableIndexMoves(this.gameArrCurrent);
            var randomIndex = Math.floor((Math.random() * moves.length));
            
            this.tweenTiles(moves[randomIndex]);
            this.updateBoard(this.gameArrCurrent,this.tile0Index, moves[randomIndex]);
            this.tile0Index = moves[randomIndex];
            this.shufflingIndex++;
            this.scheduleOnce(function() { 
                this.waitNext = false;
                
            }, this.tileMoveSpeed*2);   
        }

    
    },
    
    //destrys all the tiles
    destroyAllTiles: function(){
        for (var i = 0; i < this.node.children.length; i++) {
            this.node.children[i].destroy();
        }
    },
    
    //increces the games size and reset the logic and graphic boards
    incGameSize: function(){
        if (!this.shuffling && !this.runningAi){
            this.gameSize ++;
            this.resetBoard();
        }
 
    },
    
    //decreces the games size and reset the logic and graphic boards 
    //as long as it bigger than 0
    decGameSize: function(){
        if (!this.shuffling && this.gameSize - 1 > 0 && !this.runningAi){
            this.gameSize --;
            this.resetBoard();
        }
        
    },

    
    //manhatan heuristic 
    // f(x) = row distance current tile from goal + column distance current tile from goal
    //search google for more information
    manhattanHeuristic: function(board,goal){
        // cc.log("manhattanHeuristic");
        var count  = 0;
        // var strTmp = '';
        for (var i = 0; i < board.length; i++) {
            if (board[i] !== goal[i]){
                var goalIndex = goal.indexOf(board[i]);
                var dx = Math.abs( Math.floor(i/this.gameSize) -  Math.floor(goalIndex/this.gameSize) );
                var dy = Math.abs( (i % this.gameSize) - (goalIndex % this.gameSize )) ;
                var dis = dx + dy;
                // strTmp +=  board[i] + ':['+ dis+'] , ';
                count += dis;
                
            }
        }
        // cc.log(strTmp);
        return count;
    },
    
    //euclidean heuristic 
    // f(x) = sqrt( (row distance current tile from goal)^2 + (column distance current tile from goal)^2 )
    //search google for more information
    euclideanHeuristic: function(board,goal){
        // cc.log("euclideanHeuristic");
        var count  = 0;
        // var strTmp = '';
        for (var i = 0; i < board.length; i++) {
            if (board[i] !== goal[i]){
                var goalIndex = goal.indexOf(board[i]);
                var dx = Math.abs( Math.floor(i/this.gameSize) -  Math.floor(goalIndex/this.gameSize) );
                var dy = Math.abs( (i % this.gameSize) - (goalIndex % this.gameSize )) ;
                var dis = Math.sqrt(dx*dx + dy*dy);
                // strTmp +=  board[i] + ':['+ dis+'] , ';
                count += dis;
            }
        }
        // cc.log(strTmp);
        return count;
    },
    
    //diagnoal heuristic  - octile Distance heuristic
    // f(x) = (row distance current tile from goal) + (column distance current tile from goal) +
    //        (sqrt(2) - 2) * min( row distance current tile from goal, column distance current tile from goal) 
    //search google for more information
    octileDistanceHeuristic: function(board,goal){
        // cc.log("octileDistanceHeuristic");
        var count  = 0;
        var d1 = 1;
        var d2 = Math.sqrt(2);
        // var strTmp = '';
        for (var i = 0; i < board.length; i++) {
            if (board[i] !== goal[i]){
                var goalIndex = goal.indexOf(board[i]);
                var dx = Math.abs( Math.floor(i/this.gameSize) -  Math.floor(goalIndex/this.gameSize) );
                var dy = Math.abs( (i % this.gameSize) - (goalIndex % this.gameSize )) ;
                var dis = d1 * (dx + dy) + (d2 - 2 * d1)* Math.min(dx,dy) ;
                // strTmp +=  board[i] + ':['+ dis+'] , ';
                count += dis;
            }
        }
        // cc.log(strTmp);
        return count;
    },
    
    
    //runs the ai as long as it isn't shuffling, changes the runningAi value to true
    //the actual runing is done at the update function
    runAi: function(){
        if (!this.shuffling){
            this.runningAi = true;

        }
        
    },
    
    //stops the ai as long as it isn't shuffling, changes the runningAi value to false
    
    stopAi: function(){
        if (!this.shuffling){
            this.runningAi = false;
        }
        
    },
    
    
    //summoned fron the update function 
    //removes the first node at the opened queue and get all it's avaliable moves
    //if it's children aren't in colsed or open queue than he adds them to the opened queue
    //and put this node the the closed queue
    //preforms a sort to the queue if the first node is a child of the current node than it tween to it
    //else it preforms a reverse and at the end it will tween to the first node at the queue after the sort
    pickNextMove: function(){
        if (this.forword){
            // var funcToUse = this.calcSingleHeuristic1;
            if (this.openedNodes.length > 0){
                var child = this.openedNodes.shift();
                // cc.log(child);
                // cc.log(this.checkEqBoards(child.board,this.gameArrGoal));
                if (!this.checkEqBoards(child.board,this.gameArrGoal)){
                    // cc.log("ai not finish");
                    this.debugLabel.string = "ai not finish";
                    //generate children
                    var movesIndexArr = this.getAvaliableIndexMoves(child.board);
                    var movesBoardArr = this.getAvaliableBoardMoves(movesIndexArr);
                    // var movesHeuristicArr = this.calcMovesHeuristic(movesBoardArr,funcToUse);  

                    //check for all the children if in open node or in closed
                    for (var i = 0; i < movesBoardArr.length; i++) {
                        
                         //f(n) = g(n) + h(n)
                        var heuristicMove = this.funcToUse(movesBoardArr[i],this.gameArrGoal);
                        heuristicMove += child.height+1;
                        //tmp children
                        var tmpChild = {
                            board:movesBoardArr[i],
                            heuristic: heuristicMove,
                            height: child.height+1,
                            _id : this.id,
                            _parent: child,
                            _srcTile: this.tile0Index,
                            _desTile: movesIndexArr[i]
                        };
                        
                        //if not in open or closed
                        if (this.checkInOpened(tmpChild) === -1 && this.checkInClosed(tmpChild) === -1){
                            // cc.log("not in ");
                            this.openedNodes.push(tmpChild);
                            this.id ++;
                            
                        }
                        //if in open
                        else if (this.checkInOpened(tmpChild) !== -1 && tmpChild.heuristic < child.heuristic){
                            
                            // cc.log("in opened");
                            
                            this.runningAi = false;
                        }
                        //if in closed
                        else if (this.checkInClosed(tmpChild) !== -1 && tmpChild.heuristic < child.heuristic){
                            //needs to reverse the current path better path
                            // cc.log("in closed");
                            // cc.log(this.openedNodes);
                            //  cc.log(this.closedNodes);
                            
                            this.runningAi = false;
                        }
                        else{
                            
                            // cc.log(tmpChild);
                        }
    
                    }

                    //put child in closed
                    this.closedNodes.push(child);
                    // cc.log(this.closedNodes);
                    
                    //sort open nodes based on heuristic
                    this.sortOpenNodes();

                    
                    //check if after sort the first node is a child of the current, else needs to reverse path
                    if (this.openedNodes.length > 0){
                        if (child._id === this.openedNodes[0]._parent._id){
                            //make the move and tween
                            var des = this.openedNodes[0]._desTile;
                            // cc.log( this.openedNodes[0]);
                            this.tweenTiles(des);
                                
                            
                            //update the board
                            this.updateBoard(this.gameArrCurrent,this.tile0Index, des);
                            this.tile0Index = des;
                            // cc.log(this.gameArrCurrent);
                            
                            //push to path
                            this.path.push(this.openedNodes[0]);
                            
                            // this.waitNext = false;
                            
                            var timeSc =this.tileMoveSpeed*2;
                            var i = 1.2;
                            this.scheduleOnce(function() { this.waitNext = false; }, timeSc * i); 
                            
                            this.debugLabel.string = "child of parent";
                        }  
                        else{
                            //reverse the path
                            this.debugLabel.string = "not child of parent need reverse";
                            
                            //find command parent
                            
                            //find down path from parent to node at the start of the queue
                            
                            
                            
                            var node1 = this.openedNodes[0];
                            var tmpI = this.path.length -1 ;
                            var node2 = this.path[tmpI];
                            
                            this.commanP = this.findCommanParent(node1,node2);
                            // cc.log(this.commanP._id);
                            
                            
                            this.downPathArr = this.findDownPath(this.commanP,node1);
                            // cc.log(this.downPathArr);
                            
                            this.forword = false;
                            this.reverse = true;
                            this.flag = false;
                            
                            
                            this.reverseNextNode();

                        }
                    }
                }
                else{
                    // cc.log("ai finish");
                    this.runningAi = false;
                    this.debugLabel.string = "ai finish";
                    this.runMode = 5;
                    this.uiController.changeBtnRunMode(this.runMode);
                    this.uiController.toggleTimer();
                    
                    
                }
    
            }
        }
        else{
            
            this.reverseNextNode();
            
        }

    },
    
    //checks if every item in board1 equal to board2 if so returns true
    //the arrays needs to be the same size
    checkEqBoards: function(board1,board2){
        for (var i = 0; i < board1.length; i++) {
            if (board1[i] != board2[i]){
                return false;
            }
        }
        return true;
    },
    
    //check if a node is in the opended queue if so returns it's index else returns -1
    checkInOpened: function(treeNode){
        for (var i = 0; i < this.openedNodes.length; i++) {
            if (this.checkEqBoards(treeNode.board,this.openedNodes[i].board)){
                if (treeNode.heuristic === this.openedNodes[i].heuristic && treeNode.height === this.openedNodes[i].height
                    && treeNode._parent._id === this.openedNodes[i]._parent._id)
                    return i;
            }
                
        }
        return -1;
    },
    
    
    //check if a node is in the closed queue if so returns it's index else returns -1
    checkInClosed: function(treeNode){
        for (var i = 0; i < this.closedNodes.length; i++) {
            if (this.checkEqBoards(treeNode.board,this.closedNodes[i].board))
                if (treeNode.heuristic === this.openedNodes[i].heuristic && treeNode.height === this.openedNodes[i].height
                     && treeNode._parent._id === this.openedNodes[i]._parent._id)
                    return i;
        }
        return -1;
    },

    //compare function to use in sorting the array from the lowest heuristic to highest
    compare: function(a,b){
        if (a.heuristic < b.heuristic )
            return -1;
        if (a.heuristic > b.heuristic  )
            return 1;
        return 0;
        
    },
    
    //sorting the opennodes array
    sortOpenNodes: function(){
        this.openedNodes.sort(this.compare);
    },
    

    //summong from pickNextMove function which is run at the update function when needs to reverse the current path (when batter path is found)
    //first it reverses to the command parent, at the end if there is a down path to the better node it 
    //preforms it if not jsut moves the the better node
    reverseNextNode: function(){
        var tmpIndex = this.path.length - 1;
        var lastNode = this.path[tmpIndex];
        
        if(this.reverse){
             // if (!this.checkEqBoards(this.openedNodes[0]._parent.board,this.gameArrCurrent) && !this.flag){
            if (this.commanP._id !== lastNode._id && !this.flag){
                // cc.log("reverse next");
                this.debugLabel.string = "reversing up";
                var des = lastNode._srcTile;
                
                this.tweenTiles(des);
                        
                //update the board
                this.updateBoard(this.gameArrCurrent,this.tile0Index, des);
                this.tile0Index = des;   
                this.path.pop();
                
                var timeSc =this.tileMoveSpeed*2;
                var i = 1.2;
                this.scheduleOnce(function() { this.waitNext = false; }, timeSc * i); 
                
                
            }
            else{
                //push down path and the last node
                if (this.downPathArr.length > 0){
                    
                    var nodeDown = this.downPathArr.shift();
                    this.path.push(nodeDown);
                    //make move
                    tmpIndex = this.path.length - 1;
                    lastNode = this.path[tmpIndex];
                    
                    var des = lastNode._desTile;
                    this.tweenTiles(des);
                    
                    //update the board
                    this.updateBoard(this.gameArrCurrent,this.tile0Index, des);
                    this.tile0Index = des;
                    
                    this.reverse = false;
                    this.debugLabel.string = "reversing down";
                    
                    var timeSc =this.tileMoveSpeed*2;
                    var i = 1.2;
                    this.scheduleOnce(function() { this.waitNext = false; }, timeSc * i); 
                    
                    
                }
                else{
                    
                    this.debugLabel.string = "finished reversing";
                    var des = this.openedNodes[0]._desTile;
                    // cc.log( this.openedNodes[0]);
                    this.tweenTiles(des);
                        
                    
                    //update the board
                    this.updateBoard(this.gameArrCurrent,this.tile0Index, des);
                    this.tile0Index = des;
                    // cc.log(this.gameArrCurrent);
                    
                    //push to path
                    this.path.push(this.openedNodes[0]);
                    
                    
                    this.forword = true;
                    this.reverse = false;
                    this.flag = false;
                    
                    
                    var timeSc =this.tileMoveSpeed*2;
                    var i = 1.2;
                    this.scheduleOnce(function() { this.waitNext = false; }, timeSc * i); 
                }
            }
        }
        else{
            
            if (this.downPathArr.length>0 && !this.flag){
                // cc.log("reverse next");
                this.debugLabel.string = "reversing down";
                
                var nodeDown = this.downPathArr.shift();
                this.path.push(nodeDown);
                
                tmpIndex = this.path.length - 1;
                lastNode = this.path[tmpIndex];
                
                var des = lastNode._desTile;
                
                this.tweenTiles(des);
                        
                //update the board
                this.updateBoard(this.gameArrCurrent,this.tile0Index, des);
                this.tile0Index = des;   
                // this.path.pop();
                
                var timeSc =this.tileMoveSpeed*2;
                var i = 1.2;
                this.scheduleOnce(function() { this.waitNext = false; }, timeSc * i); 
                
                
            }
            else{
                this.debugLabel.string = "reversing  finished";
                var des = this.openedNodes[0]._desTile;
                // cc.log( this.openedNodes[0]);
                this.tweenTiles(des);
                    
                
                //update the board
                this.updateBoard(this.gameArrCurrent,this.tile0Index, des);
                this.tile0Index = des;
                // cc.log(this.gameArrCurrent);
                
                //push to path
                this.path.push(this.openedNodes[0]);
                
                
                this.forword = true;
                this.reverse = false;
                this.flag = false;
                
                var timeSc =this.tileMoveSpeed*2;
                var i = 1.2;
                this.scheduleOnce(function() { this.waitNext = false; }, timeSc * i); 
            }

        
        }
      
    },
    
    //returns the lowest comman parent
    findCommanParent: function(node1,node2){
        var arrIdsP1 = [];
        var arrP1 = [];
        var arrIdsP2 = [];
        var arrP2 = [];
        var tmpPN = null;
        var foundId = -1;
        
        //finding the node1 parents
        tmpPN = node1._parent;
        while( tmpPN != null){
            arrIdsP1.push(tmpPN._id);
            arrP1.push(tmpPN);
            // cc.log(tmpPN._id);
            tmpPN = tmpPN._parent;
        }
        //finding the node2 parents
        tmpPN = node2._parent;
        while( tmpPN != null){
            arrIdsP2.push(tmpPN._id);
            arrP2.push(tmpPN);
            // cc.log(tmpPN._id);
            tmpPN = tmpPN._parent;
        }
        
        //finding comman parent
        if (arrIdsP1.length < arrIdsP2.length){
            for (var i = 0; i < arrIdsP1.length && foundId === -1; i++) {
                foundId = arrIdsP2.indexOf(arrIdsP1[i]);
            } 
            
            return arrP2[foundId];
        }
        else{
            for (var i = 0; i < arrIdsP2.length && foundId === -1; i++) {
                foundId = arrIdsP1.indexOf(arrIdsP2[i]);
            } 
            
            return arrP1[foundId];
        }
        
        
    },
    
    //finds path variable from node to variable to to
    findDownPath: function(from,to){
        var tmpPN = null;
        var stack = [];
        
        
        if (from._id !== to._id){
            tmpPN = to._parent;
            while( tmpPN._id !== from._id){
                stack.push(tmpPN);
                tmpPN = tmpPN._parent;
            }
        }
        
        
        return stack.reverse();
    },
    

    //updates the graphic state run button and put it to the next state
    //at the end state reset the logic board
    btnRun: function(){
        switch(this.runMode){
            case 1:
                
                if (!this.shuffling){
                    this.shuffleBaord();
                    this.runMode = 2;
                    this.uiController.changeBtnRunMode(this.runMode);    
                }
                break;
                
            case 3:

                if (!this.shuffling){
                    //running
                    this.uiController.toggleTimer();
                    this.runningAi = true;
                    this.runMode = 4;
                    this.uiController.changeBtnRunMode(this.runMode);
                }
                break;
                
            case 4:

                if (!this.shuffling){
                    //stoping
                    this.uiController.toggleTimer();
                    this.runningAi = false;
                    this.runMode = 3;
                    this.uiController.changeBtnRunMode(this.runMode);
                    
                }
                break;
            
            case 5:

                if (!this.shuffling){
                    
                    this.runMode = 1;
                    this.uiController.changeBtnRunMode(this.runMode);
                    this.uiController.resetTimer();
                    
                    this.debugLabel.string = "debug";
                    this.openedLabel.string = "opened nodes: 0" ;
                    this.closedLabel.string = "closed nodes: 0" ;
                    this.tile0Index = this.gameSize*this.gameSize - 1;
                    this.openedNodes = [];
                    this.closedNodes = [];
                    this.path = [];
                    this.runningAi = false;
                    this.waitNext = false;
                    this.reverse = false;
                    this.forword = true;

                    
                }
                break;
                
            
        }
    },
    
    //resets the logic/graphic board and the debug labels
    resetBoard: function(){
        if (!this.shuffling && !this.runningAi){
            this.uiController.resetTimer();

            this.initGameBoards();
            this.destroyAllTiles();
            this.initGraphicBoard();
            
            this.runMode = 1;
            this.uiController.changeBtnRunMode(this.runMode);
            this.uiController.initLblShuffles(this.numOfShuffles);
            this.debugLabel.string = "debug";
            this.openedLabel.string = "opened nodes: 0" ;
            this.closedLabel.string = "closed nodes: 0" ;
        }
        
    },
    
    
    //increses the speed of the tween the higher the slower the tween
    incTweenSpeed: function(){
        if (!this.shuffling && !this.runningAi)
            this.tileMoveSpeed += this.tileMoveSpeedInc;
    },
    
    //decreses the speed of the tween the lower the faster the tween as long as it above tileMinMoveSpeed
    decTweenSpeed: function(){
        if (!this.shuffling && !this.runningAi){
            if (Math.abs(this.tileMoveSpeed - this.tileMinMoveSpeed) > 0.01)
                this.tileMoveSpeed -= this.tileMoveSpeedInc;    
        }
        
    },
    
    //increses the number of shuffles 
    incNumShuffles: function(){
        if (!this.shuffling && !this.runningAi){
            this.numOfShuffles++;    
        }
        
    },
    
    //decreses the number of shuffles as long as it higher than 1
    decNumShuffles: function(){
        if (!this.shuffling && !this.runningAi && this.numOfShuffles>1){
            this.numOfShuffles--;    
        }
        
    },
    
    //put in use the next heuristic as long as it exists
    nextHeurisitc: function(){
        if (this.heuristicIndex + 1 < this.heuristicsNum){
            this.heuristicIndex++;
            switch(this.heuristicIndex){
                
                case 0:
                    this.funcToUse = this.manhattanHeuristic;
                    break;
                case 1:
                    this.funcToUse = this.euclideanHeuristic;
                    break;
                case 2:
                    this.funcToUse = this.octileDistanceHeuristic; 
                    break;
            }
        }
    },
    
    //put in use the previous heuristic as long as it exists
    prevHeurisitc: function(){
        if (this.heuristicIndex - 1 >= 0){
            this.heuristicIndex--;
            switch(this.heuristicIndex){
                
                case 0:
                    this.funcToUse = this.manhattanHeuristic;
                    break;
                case 1:
                    this.funcToUse = this.euclideanHeuristic;
                    break;
                case 2:
                    this.funcToUse = this.octileDistanceHeuristic; 
                    break;
            }
        }
    },
  
    
    
    /*
    all the functions below are for debug purpose, they aren't use in the algorithm

    */
    
    //return string of the item in the array for debug
    getOpenedNodeDebugString: function(arr,index){
        if (arr[index]._parent === null){
            return 'id:'+arr[index]._id.toString()+ ' parent : null' + ' H:' +  arr[index].height + 
        ' src:'+ arr[index]._srcTile + ' des:' +  arr[index]._desTile +
        ' heur:' + arr[index].heuristic + '  board: ['+ arr[index].board.toString() + ']';
        }
        else{
            return 'id:'+arr[index]._id.toString()+ ' parent :'+arr[index]._parent._id.toString() + ' H:' +  arr[index].height + 
        ' src:'+ arr[index]._srcTile + ' des:' +  arr[index]._desTile +
        ' heur:' + arr[index].heuristic + '  board: ['+ arr[index].board.toString() + ']';    
        }
        
                        
    },
    
    
    //clears the list view and put all the items from opend array
    showOpened: function(){
        this.scrollNode.clearItems();
        var strTop = 'This is opened nodes num: ' + this.openedNodes.length;
        this.scrollNode.addItem(strTop);
        for (var i = 0; i < this.openedNodes.length; i++) {
            var itemStr = this.getOpenedNodeDebugString(this.openedNodes,i);
            this.scrollNode.addItem(itemStr);
        }
      
        
    },
    
    //clears the list view and put all the items from closed array
    showClosed: function(){
        this.scrollNode.clearItems();
        var strTop = 'This is closed nodes num: ' + this.closedNodes.length;
        this.scrollNode.addItem(strTop);
        for (var i = 0; i < this.closedNodes.length; i++) {
            var itemStr = this.getOpenedNodeDebugString(this.closedNodes,i);
            this.scrollNode.addItem(itemStr);
        }
    },
    
    //clears the list view and put all the items from path array
    showPath: function(){
        this.scrollNode.clearItems();
        var strTop = 'This is path nodes num: ' + this.path.length;
        this.scrollNode.addItem(strTop);
        for (var i = 0; i < this.path.length; i++) {
            var itemStr = this.getOpenedNodeDebugString(this.path,i);
            this.scrollNode.addItem(itemStr);
        }
    },
    
    //clears the list view and put all the avaliable moves
    showAvaliablePaths: function(){
        this.scrollNode.clearItems();
        this.scrollNode.addItem("This is Avaliable path");

        var tmpStr = '';
        var movesIndexArr = this.getAvaliableIndexMoves(this.gameArrCurrent);
        var movesBoardArr = this.getAvaliableBoardMoves(movesIndexArr);
        for (var i = 0; i < movesBoardArr.length; i++) {
            var heuristicMove = this.funcToUse(movesBoardArr[i],this.gameArrGoal);
            var heightTmp = this.openedNodes[0].height + 1;
            heuristicMove +=  heightTmp;
            tmpStr = '[' + movesBoardArr[i].toString() + ']' + ' '+'heuristic :' + heuristicMove + ' height: ' + heightTmp;
            this.scrollNode.addItem(tmpStr);  
        }
        
    },
    
   
  
    
    
});

