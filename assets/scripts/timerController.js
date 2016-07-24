/*
time controller script
displayes the running time of the AI
need to put it on the Label componnet
it's accessed from the Game controller script

*/
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        this.getMyComponents();
        this.resetTimer();
        
    },
    
    initVariables: function(){
        this.time = 0;
        this.timerRunning = false;
    },

    getMyComponents: function(){
        this.lbl =  this.node.getComponent(cc.Label);
    },
    
    resetTimer: function(){
        this.initVariables();
        this.updateLabel();
    },
    
    toggleTimer: function(){
        this.timerRunning = !this.timerRunning;
    },
    
    
    updateLabel: function(){
        this.lbl.string = 'time: ' + this.time.toFixed(2);
    },
 

    update: function (dt) {
        if (this.timerRunning){
            this.time += dt;
            this.updateLabel();
            
        }  
    },
    
    
});
