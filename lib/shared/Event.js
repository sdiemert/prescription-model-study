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
    
    toTransferObject(){
        return {datetime : this._time};
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
    
    toTransferObject(){
        return {
            datetime : this.time,
            substance : this.substance,
            units : this.unit,
            dose : this.dose,
            type : 'medication'
        }
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
     
    toTransferObject(){
        return {
            datetime : this.time,
            type : 'food'
        }
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
     
    toTransferObject(){
        return {
            datetime : this.time,
            type : 'awake'
        }
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
     
    toTransferObject(){
        return {
            datetime : this.time,
            type : 'sleep'
        }
    }
}

module.exports = {
    Event              : Event,
    AdministrationEvent: AdministrationEvent,
    AwakeEvent : AwakeEvent,
    SleepEvent : SleepEvent,
    FoodEvent : FoodEvent
};
