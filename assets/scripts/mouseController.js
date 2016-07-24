/*
mouse controller script
wasn't impemented but the struct of the mouse events exists

*/

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.moveInitPos = cc.p(0, 0);
        this.moveToPos = cc.p(0, 0);
        this.isMoving = false;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                var touchLoc = touch.getLocation();
                this.isMoving = true;
                // this.moveInitPos = this.parent.convertToNodeSpaceAR(touchLoc);
                // self.moveToPos = self.follower.parent.convertToNodeSpaceAR(touchLoc);
                // this.moveInitPos = cc.p(this.node.x,this.node.y);
                // cc.log(this.moveInitPos);
                // cc.log("began");
                return true; // don't capture event
            },
            onTouchMoved: function(touch, event) {
                var touchLoc = touch.getLocation();
                // self.touchLocationDisplay.string = i18n.t("cases/03_gameplay/01_player_control/SpriteFollowTouch.js.1") + Math.floor(touchLoc.x) + ', ' + Math.floor(touchLoc.y) + ')';
                // self.moveToPos = self.follower.parent.convertToNodeSpaceAR(touchLoc);
                // cc.log("move");
            },
            onTouchEnded: function(touch, event) {
                this.isMoving = false; // when touch ended, stop moving
                // cc.log("ended");
            }
        }, this.node);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
