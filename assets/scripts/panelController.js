/*
panel controller script
hides and reveal the run pannel and the settings panel
need to put it on the parent node of all the ui componnets in the panel
it's accessed from the click events of the buttons

*/

cc.Class({
    extends: cc.Component,

    properties: {
        moveSpeed: 0.25,
        offsetX:0,
        offsetY:0
    },

    // use this for initialization
    onLoad: function () {
        this.initVariables();
    },
    
    /*
    saves the start point of the panel
    */
    initVariables: function(){
        this.initX = this.node.x;
        this.initY = this.node.y;
        this.panelMoving = false;
        this.showMode = false;
    },
    

    
    toggleMode: function(){
        
        if (!this.panelMoving){
            //locks the toggle function while moving and init the position 
            //of the next state
            this.panelMoving = true;
            var desY = 0;
            var desX = 0;
            if (!this.showMode){
                desX = this.offsetX + this.initX;
                desY = this.offsetY + this.initY;
                
            }  
            else{
                desX = this.initX;
                desY = this.initY;
            }
            
            //creates the animations and toggle the state 
            //and release the lock after the animation finished
            var moveAction = cc.moveTo(this.moveSpeed, cc.p(desX, desY));
            this.node.runAction(moveAction);   
            this.scheduleOnce(function() { 
                this.showMode = !this.showMode;
                this.panelMoving = false;
                
            }, this.moveSpeed * 2 );   
        }
        
    },
});
