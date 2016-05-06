"use strict"
/**
 * Created by sdiemert on 2016-05-03.
 */

class Timeline {

    constructor(name, length) {

        this._name   = name;
        this._length = length;
        this._events = [];
        
    }

    get events(){
        return this._events;
    }

    /**
     * @param e {Event}
     */
    addEvent(e){
        this.events.push(e);
        this.events.sort(function(x, y){
            if(x.time > y.time ) return 1;
            else if(x.time < y.time ) return -1;
            else return 0;
        });
    }
    
    get length() {
        return this._length;
    }

    set length(l) {
        this._length = l;
    }

    get name() {
        return this._name;
    }

    set name(n) {
        this._name = n;
    }

    /**
     * Formulates the events of the timeline as clusters (arrays)
     * 
     * @param secs {number} the number of seconds in a cluster
     * 
     * @return {Event[][]} inner arrays are clusters.
     */
    clusterEvents(secs){
        
        if(secs <= 0) return [];
        
        var toReturn = []; 
        
        var ms = secs * 1000;  //dates work in ms. 
        
        var anchor = this.events[0].time.getTime(); 
        var tmpArr = [this.events[0]]; 
        
        for(var i = 1; i < this.events.length; i++){
            
            if(this.events[i].time.getTime() - anchor < ms){
                tmpArr.push(this.events[i]);
            }else{
                toReturn.push(tmpArr);
                tmpArr = [this.events[i]];
                anchor = this.events[i].time.getTime(); 
            }
        }

        toReturn.push(tmpArr);
        
        return toReturn;
        
    }
}

module.exports = Timeline;
