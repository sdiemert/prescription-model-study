/**
 * Create by sdiemert on 2016-05-05
 *
 * Unit tests for: FILE TO TEST.
 */

var assert   = require('assert');
var Timeline = require('../lib/shared/Timeline');
var Event    = require('../lib/shared/Event').Event;

describe("Timeline", function () {

    beforeEach(function (done) {

        done();

    });

    afterEach(function (done) {

        done();

    });

    describe("#clusterEvents()", function () {

        var T = null; 

        beforeEach(function (done) {

            T = new Timeline(); 
            
            T.addEvent(new Event(new Date('2016-01-02 8:00')));
            T.addEvent(new Event(new Date('2016-01-02 9:00')));
            T.addEvent(new Event(new Date('2016-01-02 9:01')));
            T.addEvent(new Event(new Date('2016-01-02 9:02')));
            T.addEvent(new Event(new Date('2016-01-02 9:14')));
            T.addEvent(new Event(new Date('2016-01-02 9:15')));
            T.addEvent(new Event(new Date('2016-01-02 9:16')));
            T.addEvent(new Event(new Date('2016-01-02 9:20')));
            T.addEvent(new Event(new Date('2016-01-02 9:45')));
            T.addEvent(new Event(new Date('2016-01-02 12:00')));
            
            done();
        });

        afterEach(function (done) {
            delete T; 
            T = null; 
            done();
        });

        it("should return 6 clusters of 15 min", function (done) {
            var C = T.clusterEvents(60*15);
            assert.equal(C.length, 5);
            assert.equal(C[0].length, 1);
            assert.equal(C[1].length, 4);
            assert.equal(C[2].length, 3);
            assert.equal(C[3].length, 1);
            assert.equal(C[4].length, 1);
            done();
        });
        
        it("should be able to cluster a single item", function(){
            
            var T2 = new Timeline(); 
            T2.addEvent(new Event(new Date("2016-01-01 8:00")));
            var C = T2.clusterEvents(60*15);
            assert.equal(C.length, 1);
            assert.equal(C[0].length, 1);
            
        });
        
        it("should return empty for zero and negative input",function(){
            var C = T.clusterEvents(-1);
            assert.deepEqual(C, []);
            C = T.clusterEvents(0);
            assert.deepEqual(C, []);
        });


    });

});