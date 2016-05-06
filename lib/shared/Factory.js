/**
 * Created by sdiemert on 2016-05-03.
 */

var AdministrationEvent = require('./Event').AdministrationEvent;
var FoodEvent           = require('./Event').FoodEvent;
var AwakeEvent           = require('./Event').AwakeEvent;
var SleepEvent           = require('./Event').SleepEvent;
var Event               = require('./Event').Event;
var Timeline            = require('./Timeline');

/**
 * Given an an object representing an event create
 * the corresponding event object
 *
 * @param e {object}
 * @param e.type {string}
 * @param e.datetime {Date|string}
 * @param e.substance {string}
 * @param e.dose {number}
 * @param e.units {string}
 */
function createEvent(e) {

    if (e.type === 'medication') {
        return new AdministrationEvent(e.datetime, e.dose, e.units, e.substance);
    } else if (e.type === 'food') {
        return new FoodEvent(e.datetime, e.substance);
    } else if (e.type === 'awake') {
        return new AwakeEvent(e.datetime);
    } else if (e.type === 'sleep') {
        return new SleepEvent(e.datetime);
    } else {
        return null;
    }

}

/**
 * Transforms an array of API objects into an array of Event
 * objects.
 *
 * @param data {Array}
 *
 * @returns {Array}
 */
function createEvents(data) {

    var E = [];
    for (var i = 0; i < data.length; i++) {
        E.push(createEvent(data[i]));
    }

    return E;

}

/**
 * Given an array of data points representing events
 * create a time object.
 *
 * @param data {Event[]}
 *
 * @returns {Timeline}
 */
function createTimeline(data) {

    var T = new Timeline(null, 24);

    for (var i = 0; i < data.length; i++) {
        T.addEvent(data[i]);
    }

    return T;

}

/**
 * Finds the stop index of a series of events
 * @param data {Event[]} the array of events to consider
 * @param i {number} the index to start looking at.
 * @private
 *
 * @returns {number} the index at which the day indicated by param i stops,
 -1 if end of array.
 */
function _findDayStop(data, i) {

    if (i >= data.length) return -1;

    var day = data[i].time.getDate();

    while (i < data.length && data[i].time.getDate() === day) {
        i++;
    }

    return i - 1;  // loop overshoots counter, remove 1.


}


/**
 * Creates a series of Timeline objects base
 * on the data. Makes each timeline one unit in length
 *
 * @param data {Array}
 * @param unit {"day"|"week"}
 *
 * @returns {Array}
 */
function createTimelines(data, unit) {

    if (unit === "day") {

        var E        = createEvents(data);
        var toReturn = [];
        var tmp      = null;
        var i        = 0, j = 0;

        var firstPass = true;

        while (i !== -1 && i < data.length) {

            j = i;
            i = _findDayStop(E, !firstPass ? j + 1 : 0);

            if (i !== -1) {

                tmp = new Timeline();

                for (var k = j; k <= i; k++) {
                    tmp.addEvent(E[k]);
                }

                toReturn.push(tmp);
            }

            firstPass = false;
        }

        return toReturn;

    } else {
        return [];
    }

}

// Awkward export at bottom to make play with Node
if (typeof module !== 'undefined') {
    module.exports = {
        createEvent    : createEvent,
        createEvents   : createEvents,
        createTimeline : createTimeline,
        createTimelines: createTimelines,
        _findDayStop   : _findDayStop
    }
}
