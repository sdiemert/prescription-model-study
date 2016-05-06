"use strict";
/**
 * Created by sdiemert on 2016-05-03.
 */

class Event {

    /**
     * @param time {Date}
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
        return null;
    }
    
    getImage(){
        return null; 
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

class FoodEvent extends Event{

    /**
     * @param time {date}
     * @param substance {string}
     */
    constructor(time, substance){
        super(time);
        this.substance = substance;
    }
    
    getText(){
        return null; 
    }

    getImage(){
        return "images/food.png";
    }
}

class AwakeEvent extends Event{

    /**
     * @param time {date}
     * @param substance {string}
     */
    constructor(time){
        super(time);
    }
    
    getText(){
        return null; 
    }

    getImage(){
        return "images/sun.png";
    }
}
class SleepEvent extends Event{

    /**
     * @param substance {string}
     */
    constructor(time){
        super(time);
    }
    
    getText(){
        return null; 
    }

    getImage(){
        return "images/moon.png";
    }
}

module.exports = {
    Event              : Event,
    AdministrationEvent: AdministrationEvent,
    AwakeEvent : AwakeEvent,
    SleepEvent : SleepEvent,
    FoodEvent : FoodEvent
};
