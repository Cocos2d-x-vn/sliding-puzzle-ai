/*
move list controller script
rotates thro the items list with next item and previous item functions
need to put it on Label componnets and define the items
it's accessed from the click events of the buttons

*/


cc.Class({
    extends: cc.Component,

    properties: {
        items: {
          default: [],
          type: ['String']
        }
    },

    // use this for initialization
    onLoad: function () {
        this.initVariables();
        this.getMyComponents();
    },

     initVariables: function(){
         this.index = 0;
     },

    getMyComponents: function(){
        this.sizeLbl = this.node.getChildByName("itemLbl").getComponent(cc.Label);
        this.sizeLbl.string = this.items[this.index];
    },
    
    //moves to the next items as long as it exists
    moveToNext: function(){
        if (this.index  < this.items.length - 1 ){
            this.index++;
            this.sizeLbl.string = this.items[this.index];
        }
    },
    
    //moves to the previous items as long as it exists
    moveToPrev: function(){
        if (this.index  > 0 ){
            this.index--;
            this.sizeLbl.string = this.items[this.index];
        }
    },
});
