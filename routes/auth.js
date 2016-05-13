var express = require('express');
var router  = express.Router();

var DB = require('../lib/db/DB');

router.post('/', function(req, res){

     // auth calls here
    
    DB.authUser(req.body.user, req.body.secret, function(row){

        console.log(row);

        if(!row){
            res.status(401).json({message : "authentication failed"});
        }else{
            req.session.auth = true;
            req.session.user = row.name;
            req.session.userid = row.ID;
            res.status(200).json({redirect : "/study"});
        }

    });


});


module.exports = router;
