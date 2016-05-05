/**
 * Created by sdiemert on 2016-03-14.
 */

var viz = require("./axis");

function getData(){

    $.get("/study/data", function(data, status){

        viz.showViz(null,data);

    });

}

module.exports = {getData : getData};
