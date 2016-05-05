"use strict";
/**
 * Created by sdiemert on 2016-05-03.
 */

class Event {

    /**
     * @param time {date}
     */
    constructor(time) {
        this._time = new Date(time);
    }

    get time() {
        return this._time;
    }

    set time(t) {
        this._time = new Date(t);
    }
    
    getText(){
        return "generic event";
    }

}

class AdministrationEvent extends Event{

    /**
     * @param time {date}
     * @param dose {number}
     * @param unit {string}
     * @param substance {string}
     */
    constructor(time, dose, unit, substance){
        super(time);
        this.dose = dose;
        this.unit = unit;
        this.substance = substance;
    }
    
    getText(){
        
        var s = this.substance;
        s += " "+this.dose+" "+this.unit; 
        
        return s; 
        
    }

}

// Awkward export at bottom to make play with Node
if (typeof exports !== 'undefined') {
    module.exports = {
        Event              : Event,
        AdministrationEvent: AdministrationEvent
    }
}
