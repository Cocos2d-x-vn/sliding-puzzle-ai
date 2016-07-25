/*
info panel controller script
controller the visiablty of the info panel and open new tab to my website
need to put it on panel parent
it's accessed from the click events of the buttons and clickes on name and website labels in the panel

*/


cc.Class({
    extends: cc.Component,

    properties: {
        visable: true
    },

    // use this for initialization the panel state and the website url
    onLoad: function () {
        this.siteUrl = 'http://madebyjacob.com/';
        this.githubUrl = 'https://github.com/JacobSobolev/sliding-puzzle-ai';
        if (this.visable){
            this.node.active = true;
        }
        else{
            this.node.active = false;
        }
    },
    
    tooglePanel: function(){
        if (!this.visable){
            this.node.active = true;
            this.visable = !this.visable;
        }
        else{
            this.node.active = false;
            this.visable = !this.visable;
        }
    },
    
    //open new tab to the website
    goToSite: function(){
        window.open(this.siteUrl, '_blank'); 
    },
    
    //open new tab to the website
    goToSource: function(){
        window.open(this.githubUrl, '_blank'); 
    },
});
