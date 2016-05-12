var express = require('express');
var router = express.Router();

var Factory = require('../lib/shared/Factory.js');

var DBInterface = require("../lib/db/DB");
var d = new DBInterface('database/study.db');

d.connect(function(err){
    if(err) {
        console.log("DB ERROR: "+err);
        process.exit(1);
    }
});

d.init("database/data.json"); 

var Timeline = require("../lib/shared/Timeline.js");

router.get('/', function(req, res, next) {

    Factory.createEvent({type : 'foo'});
    res.render("study", {});

});

router.get('/data', function(req, res, next){

    res.json(d.data);

});



module.exports = router;
