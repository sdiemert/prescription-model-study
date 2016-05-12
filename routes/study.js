var express = require('express');
var router = express.Router();

var Factory = require('../lib/shared/Factory.js');
var Timeline = require("../lib/shared/Timeline.js");

var DBInterface = require("../lib/db/DB");
var d = new DBInterface('database/study.db');

d.connect(function(err){
    if(err) {
        console.log("DB ERROR: "+err);
        process.exit(1);
    }
});

d.init("database/data.json"); 


router.get('/', function(req, res, next) {

    Factory.createEvent({type : 'foo'});
    res.render("study", {});

});

router.get('/data', function(req, res, next){

    
    d.getSequence(0, function(result){

        var toSend = []; 
        
        for(var i = 0; i < result.length; i++){
            toSend.push(result[i].toTransferObject()); 
        }
        
        res.json(toSend);
        
    });

});



module.exports = router;
