var express = require('express');
var router = express.Router();

var Factory = require('../lib/shared/Factory.js');
var Timeline = require("../lib/shared/Timeline.js");

var d = require("../lib/db/DB");

router.use(function(req, res, next){
    if(!req.session || !req.session.auth){
        res.redirect("/");
    }else{
        next(null); 
    }
});

router.get('/', function(req, res, next) {
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

        var seq = parseInt(req.query.sequence);

        var adherent = (req.query.adherent === 'true');
        
        var uid = req.session.userid; 
        
        console.log("RESPONSE " + "user : "+ uid + " : " +JSON.stringify(req.query));
        
        // get user from cookie
        
        
        // send result to db.

        d.recordResponse(seq, adherent, uid, function(){
            
            // send next sequence
            sendSequence(seq+1, res);

        });


    }
    
});


function sendSequence(seq, res){
    
    console.log("looking up sequence: "+ seq)
    
    d.getSequence(seq, function(result, rx){

        if(result.length === 0){

            res.status(204).send("DONE");

        }else{
            var toSend = [];
            for(var i = 0; i < result.length; i++){
                toSend.push(result[i].toTransferObject());
            }
            res.json({sequenceNo : seq, data : toSend, rx : rx});
        }


    }); 
}


module.exports = router;
