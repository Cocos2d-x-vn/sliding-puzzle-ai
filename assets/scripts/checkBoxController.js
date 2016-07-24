/*
check box controller script
controls the visibility of the checkbox toggles between two modes
need to put it on parent that has all the Components of the checkbox
it's accessed from the click events on the checkbox or the label

*/

cc.Class({
    extends: cc.Component,

    properties: {
        initMode: false
    },

    // use this for initialization
    onLoad: function () {
        this.initComponents();
    },
    

    initComponents : function(){
        this.checkSp = this.node.getChildByName("check").getComponent(cc.Sprite);
        if (!this.initMode){
            this.checkSp.enabled = false;
        }
        else{
            this.checkSp.enabled = true;
        }
    },
    
    //toogles the visibility of the check sprite
    toggleMode: function(){
        if (this.initMode){
            this.checkSp.enabled = false;
            this.initMode = !this.initMode;
        }
        else{
            this.checkSp.enabled = true;
            this.initMode = !this.initMode;
        }
    },
});
