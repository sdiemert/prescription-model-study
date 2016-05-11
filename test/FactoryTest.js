/**
 * Create by sdiemert on 2016-05-03
 *
 * Unit tests for: FILE TO TEST.
 */

var assert              = require('assert');
var Factory             = require('../lib/shared/Factory.js');
var AdministrationEvent = require('../lib/shared/Event.js').AdministrationEvent;
var Timeline            = require('../lib/shared/Timeline');

describe("Factory", function () {

    var data = null;

    beforeEach(function (done) {

        data = [
            {type: 'medication', datetime: '2016-01-01 8:00', dose: 10, units: 'mg', substance: 'foo'},
            {type: 'medication', datetime: '2016-01-01 9:00', dose: 10, units: 'mg', substance: 'foo'},
            {type: 'medication', datetime: '2016-01-01 11:00', dose: 10, units: 'mg', substance: 'foo'},
            {type: 'medication', datetime: '2016-01-02 11:00', dose: 10, units: 'mg', substance: 'foo'},
            {type: 'medication', datetime: '2016-01-02 12:00', dose: 10, units: 'mg', substance: 'foo'},
            {type: 'medication', datetime: '2016-01-03 11:00', dose: 10, units: 'mg', substance: 'foo'},
            {type: 'medication', datetime: '2016-01-03 12:00', dose: 10, units: 'mg', substance: 'foo'},
            {type: 'medication', datetime: '2016-01-03 13:00', dose: 10, units: 'mg', substance: 'foo'},
            {type: 'medication', datetime: '2016-01-03 14:00', dose: 10, units: 'mg', substance: 'foo'},
            {type: 'medication', datetime: '2016-01-03 15:00', dose: 10, units: 'mg', substance: 'foo'},
            {type: 'medication', datetime: '2016-01-05 15:00', dose: 10, units: 'mg', substance: 'foo'},
            {type: 'medication', datetime: '2016-01-06 15:00', dose: 10, units: 'mg', substance: 'foo'},
            {type: 'medication', datetime: '2016-01-06 17:00', dose: 10, units: 'mg', substance: 'foo'}
        ];

        done();
    });

    afterEach(function (done) {
        data = null;
        done();
    });

    describe("#createEvent()", function () {

        it("should create a new event", function (done) {
            var e = Factory.createEvent(data[0]);
            assert.equal(e.dose, 10);
            done();
        });

        it("should return null for unknown data type", function () {
            var e = Factory.createEvent({type: 'foo'});
            assert.equal(e, null);
        });

    });


    describe("#_findDayStop", function () {

        var events = null;

        beforeEach(function (done) {
            events = Factory.createEvents(data);
            done();
        });

        afterEach(function (done) {
            events = null;
            done();
        });

        it("should find a range in the middle", function () {
            var j = Factory._findDayStop(events, 3);
            assert.equal(j, 4);
        });

        it("should find a single number", function () {
            var j = Factory._findDayStop(events, 10);
            assert.equal(j, 10);
        });

        it("should handle start of array", function () {
            var j = Factory._findDayStop(events, 0);
            assert.equal(j, 2);
        });

        it("should handle end of array", function () {
            var j = Factory._findDayStop(events, 11);
            assert.equal(j, 12);
        });

        it("should return -1 on out of bounds index", function () {
            var j = Factory._findDayStop(events, 13);
            assert.equal(j, -1);
        });

        it("should return normal on last index", function () {
            var j = Factory._findDayStop(events, 12);
            assert.equal(j, 12);
        });

    });

    describe("#createTimelines()", function () {

        it("should create timelines", function () {
            var Ts = Factory.createTimelines(data, 'day');
            assert.equal(Ts.length, 5);
            for (var e in Ts) {
                assert.equal(Ts[e] instanceof Timeline, true);
            }
            assert.equal(Ts[0].events.length, 3);
            assert.equal(Ts[1].events.length, 2);
            assert.equal(Ts[2].events.length, 5);
            assert.equal(Ts[3].events.length, 1);
            assert.equal(Ts[4].events.length, 2);
        });

    });

});