var express = require('express');
var router = express.Router();

var Factory = require('../lib/Factory.js');

var obj = [
    {"datetime": "2016-01-01 8:00", type : 'medication', "dose": 5, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 01:00",type : 'medication',  "dose": 500, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 12:00",type : 'medication',  "dose": 50, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 14:00", type : 'medication', "dose": 50, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 17:00",type : 'medication',  "dose": 50, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 22:00",type : 'medication',  "dose": 50, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 22:10",type : 'medication',  "dose": 50, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 22:14",type : 'medication',  "dose": 50, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 22:15",type : 'medication',  "dose": 50, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 22:16",type : 'medication',  "dose": 50, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 22:45",type : 'medication',  "dose": 50, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-03 12:00",type : 'medication',  "dose": 5000, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-05 12:00",type : 'medication',  "dose": 200, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-06 12:00", type : 'medication', "dose": 2, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-08 12:00", type : 'medication', "dose": 100, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-09 12:00", type : 'medication', "dose": 100, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-10 18:00", type : 'medication', "dose": 100, "units" : "mg", "substance":"aspirin"}
];

var Timeline = require("../lib/Timeline.js");

router.get('/', function(req, res, next) {

    Factory.createEvent({type : 'foo'});
    res.render("study", {});

});

router.get('/data', function(req, res, next){

    res.json(obj);

});

module.exports = router;
