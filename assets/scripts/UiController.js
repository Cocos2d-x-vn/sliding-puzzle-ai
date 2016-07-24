/*
ui controller script
aggregates all the ui functions to a single script
need to put it on UI parent which includes all other scripts
it's accessed from various click events and game controller script

*/


cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.getUiControllers();
    },


    //init the locl variables to access the children scripts
    getUiControllers: function(){
        
        this.runPannelController = this.node.getChildByName("runPanel").getComponent("panelController");
        this.settingsPannelController = this.node.getChildByName("settingsPanel").getComponent("panelController");
        this.btnRunController = this.node.getComponentInChildren("btnRunController");
        this.timerController = this.node.getComponentInChildren("timerController");
        this.gameSizeController = this.node.getChildByName("settingsPanel").getChildByName("gameSize").getComponent("incLblController");
        this.tweenSpeedController = this.node.getChildByName("settingsPanel").getChildByName("tweenSpeed").getComponent("incLblController");
        this.heuristicController = this.node.getChildByName("settingsPanel").getChildByName("heuristicsToUse").getComponent("moveListController");
        this.shuffleController = this.node.getChildByName("settingsPanel").getChildByName("numOfShuffles").getComponent("incLblController");
        
    },
    
    
    toggleRunPanelDebug: function(){
         this.runPannelController.toggleMode();
    },
    
    changeBtnRunMode: function(mode){
        this.btnRunController.changeButtonMode(mode);
    },
    
    toggleTimer: function(){
        this.timerController.toggleTimer();
    },
    
    resetTimer: function(){
        this.timerController.resetTimer();
    },
    
    toggleSettings: function(){
        this.settingsPannelController.toggleMode();
    },
    
    incGameSize: function(){
        if (!this.timerController.timerRunning && (this.btnRunController.btnMode == 1 ||
                this.btnRunController.btnMode === 3 || this.btnRunController.btnMode === 5)){
            this.gameSizeController.incLbl();
        }
    },
    
    decGameSize: function(){
        if (!this.timerController.timerRunning && (this.btnRunController.btnMode == 1 ||
                this.btnRunController.btnMode === 3 || this.btnRunController.btnMode === 5)){
            this.gameSizeController.decLbl();
        }
    },
    
    incTweenSpeed: function(){
        if (!this.timerController.timerRunning && (this.btnRunController.btnMode == 1 ||
                this.btnRunController.btnMode === 3 || this.btnRunController.btnMode === 5)){
            this.tweenSpeedController.incLbl();
        }
    },
    
    decTweenSpeed: function(){
        if (!this.timerController.timerRunning && (this.btnRunController.btnMode == 1 ||
                this.btnRunController.btnMode === 3 || this.btnRunController.btnMode === 5)){
            this.tweenSpeedController.decLbl();
        }
    },
    
    moveToNextHeur: function(){
        if (!this.timerController.timerRunning && (this.btnRunController.btnMode == 1 || this.btnRunController.btnMode === 5)){
            this.heuristicController.moveToNext();
        }
    },
    
    moveToPrevHeur: function(){
        if (!this.timerController.timerRunning && (this.btnRunController.btnMode == 1 || this.btnRunController.btnMode === 5)){
            this.heuristicController.moveToPrev();
        }
    },
    
    initLblShuffles: function(val){
        // setLbl shuffleController
        this.shuffleController.setLbl(val);
        
    },
    
    incShuffles: function(){
        if (!this.timerController.timerRunning && (this.btnRunController.btnMode == 1 )){
            this.shuffleController.incLbl();
        }
    },
    
    decShuffles: function(){
        if (!this.timerController.timerRunning && (this.btnRunController.btnMode == 1 )){
            this.shuffleController.decLbl();
        }
    },
});
