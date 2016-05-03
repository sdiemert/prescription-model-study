var express = require('express');
var router = express.Router();

var obj = [
    {"datetime": "2016-01-01 8:00", "dose": 5, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 01:00", "dose": 500, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 12:00", "dose": 50, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 14:00", "dose": 50, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 17:00", "dose": 50, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-02 22:00", "dose": 50, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-03 12:00", "dose": 5000, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-05 12:00", "dose": 200, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-06 12:00", "dose": 2, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-08 12:00", "dose": 100, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-09 12:00", "dose": 100, "units" : "mg", "substance":"aspirin"},
    {"datetime": "2016-01-10 18:00", "dose": 100, "units" : "mg", "substance":"aspirin"}
];

router.get('/', function(req, res, next) {

    res.render("study", {});

});

router.get('/data', function(req, res, next){

    res.json(obj);

});

module.exports = router;
