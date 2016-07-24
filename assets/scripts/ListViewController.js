/*
list view controller script
the main purpose of these is to debug the qeues of the algorithm
need to put it on list view Component
it's accessed from button click events 

*/

cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: { // item template to instantiate other items
            default: null,
            type: cc.Prefab
        },
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        spacing: 0 // space between each item

    },

    // use this for initialization
    onLoad: function () {
    	this.content = this.scrollView.content;
        this.items = []; // array to store spawned items


    },
    
    //addes single item with str string with spacing on the y axis
    addItem: function(str){
        let item = cc.instantiate(this.itemTemplate);
        let lbl = item.getComponent(cc.Label).string = str;
        this.content.addChild(item);
        if (this.items.length === 0){
            item.setPosition(0, - this.spacing/2);    
        }
        else{
            let lastItem = this.items[this.items.length - 1];
            item.setPosition(0, lastItem.y - this.spacing);    
        }
        this.items.push(item);
        
        let lastItem = this.items[this.items.length - 1];
        this.content.height = Math.abs(lastItem.y);
		
    },
    
    //removes all the children on this node and clears the array
    clearItems: function(){
        for (var i = 0; i < this.content.children.length; i++) {
            this.content.children[i].destroy();
            
        }
        this.items = [];
    }

 
});
