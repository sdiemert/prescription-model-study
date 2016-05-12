var express = require('express');
var router  = express.Router();

router.post('/', function(req, res){

     // auth calls here

    req.session.auth = true;
    req.session.user = req.body.user;
    req.session.userid = 1; 
    res.status(200).json({redirect : "/study"}); 
});


module.exports = router;
