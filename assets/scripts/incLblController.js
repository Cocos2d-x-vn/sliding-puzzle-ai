/*
inc Lbl controller script
controls all the incrementions display at the settings panel
need to put it on parent that has all the Components of the setting
it's accessed from the click events of the buttons on the up and down arrows

*/



cc.Class({
    extends: cc.Component,

    properties: {
        initSize: 3,
        toInc: 1,
        minVal: 1
    },

    // use this for initialization
    onLoad: function () {
        this.getMyComponents();
    },
    

    getMyComponents: function(){
        this.lbl = this.node.getChildByName("incLbl").getComponent(cc.Label);
        
        this.lbl.string = this.initSize.toString();
    },
    
    //increase the value of the label by the toInc value
    incLbl: function(){
        this.initSize += this.toInc;
        this.updateLbl();
    },
    
    //Desrease the value of the label by the toInc value as long as it above minVal
    decLbl: function(){
        if (Math.abs(this.initSize - this.minVal) > 0.01){
            this.initSize -= this.toInc;
            this.updateLbl();
        }
        
    },
    
    //updates the Label child
    updateLbl: function(){
        if (Math.abs(Math.floor(this.initSize) - this.initSize) !== 0)
            this.lbl.string = this.initSize.toFixed(2).toString();
        else
            this.lbl.string = this.initSize.toString();
    },
    
    //sets the label string with the val accessed with gamecontroller to init 
    //the label of the game size
    setLbl: function(val){
        this.initSize = val;
        this.lbl.string = val.toString();
    },
});
