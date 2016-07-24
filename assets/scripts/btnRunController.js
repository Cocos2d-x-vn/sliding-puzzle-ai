/*
btn run controller script
controls the states of the run button, controls the text and the color
need to put it on button Component the put put the colors of the 5 states
it's accessed from gamecontroller script 

*/


cc.Class({
    extends: cc.Component,
    
    properties: {
        shuffleColor: cc.Color,
        shufflingColor: cc.Color,
        runColor: cc.Color,
        stopColor: cc.Color,
        doneColor: cc.Color
    },

    // use this for initialization
    onLoad: function () {
        this.initVariables();
        this.updateButtonMode();
    },

    initVariables: function(){
        this.btnMode = 1;
    },
    
    //updates the the text and the color of the button accessed internaly
    updateButtonMode: function(){
        switch(this.btnMode){
            case 1:
                this.node.color = this.shuffleColor;
                this.node.getComponentInChildren(cc.Label).string = 'SHUFFLE';
                break;
                
            case 2:
                this.node.color = this.shufflingColor;
                this.node.getComponentInChildren(cc.Label).string = 'SHUFFLING';
                break;
                
            case 3:
                this.node.color = this.runColor;
                this.node.getComponentInChildren(cc.Label).string = 'RUN';
                break;
            case 4:
                this.node.color = this.stopColor;
                this.node.getComponentInChildren(cc.Label).string = 'STOP';
                break;
                
            case 5:
                this.node.color = this.doneColor;
                this.node.getComponentInChildren(cc.Label).string = 'DONE - RESET';
                break;
        }
        
    },
    
    //updates the the text and the color of the button accessed externaly
    changeButtonMode: function(mode){
        this.btnMode = mode;
        this.updateButtonMode();
    },
    
});
