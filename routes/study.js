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

    return sendSequence(0, res);

});

/**
 *  Handles adherence responses (yes/no). 
 * 
 *  Returns a response with the next data.
 */
router.post("/response", function(req, res){

    if(!req.query || !req.query.adherent || !req.query.sequence){
        res.status(400).send("Bad Request"); 
    }else{

        console.log("RESPONSE " + JSON.stringify(req.query));
        
        // get user from cookie
        
        // send result to db.

        // send next sequence
        sendSequence(req.query.sequence+1, res);
    }
    
});


function sendSequence(seq, res){
    d.getSequence(seq, function(result){

        if(result.length === 0){

            res.status(204).send("DONE");

        }else{
            var toSend = [];
            for(var i = 0; i < result.length; i++){
                toSend.push(result[i].toTransferObject());
            }
            res.json({sequenceNo : seq, data : toSend});
        }


    }); 
}


module.exports = router;
