/**
 * Created by sdiemert on 2016-01-28.
 */

var SVGFactory = require("../front/SVGFactory");
var Factory    = require("../shared/Factory");
var SVG        = require("../front/svgUtil");

const TIMELINE_HEIGHT = 180;

function getData(){

    $.get("/study/data", function(data, status, xhr){

        if(204 === xhr.status){
            $("body").empty().append("<h1>DONE</h1>");
        }else{
            showViz(null,data.data, parseInt(data.sequenceNo));
        }

    });

}

function sendResponse(i, adherent) {

    console.log("sendResponse("+i+")");
    
    var url = "/study/response?sequence=" + i + "&adherent=" + adherent;

    $.post(url, function (data, status, xhr) {
        if (204 === xhr.status) {
            $("body").empty().append("<h1>DONE</h1>");
        } else {
            showViz(null, data.data, parseInt(data.sequenceNo));
        }
    });

}

/**
 *
 * @param data {Array}
 */
function _dataPreprocessor(data) {

    for (var i = 0; i < data.length; i++) {
        data[i].datetime = new Date(data[i].datetime);
    }
}

/**
 *
 * @param canvas {object}
 * @param data {Timeline[]}
 */
function _drawTimelines(data) {

    var Ts = Factory.createTimelines(data, "day");

    var wrapper = $("#wrapper");
    var canvas  = SVG.makeSVG('canvas', 1000, TIMELINE_HEIGHT * Ts.length + 100);
    wrapper.append(canvas);

    for (var i = 0; i < Ts.length; i++) {
        $(canvas).append(SVGFactory.getTimelineAsSVGGroup(Ts[i], TIMELINE_HEIGHT * (i + 1), i + 1));
    }
}

function showViz(err, data, i) {

    if (err) {
        console.log("ERROR:");
        console.log(err);
        return;
    }
    
    $("#wrapper").empty();

    _dataPreprocessor(data);
    _drawTimelines(data);

    $("#adherent-button").unbind('click');
    $("#non-adherent-button").unbind('click');
    
    $("#adherent-button").on('click', function (x) {
        console.log(x);
       sendResponse(i, true);
    });

    $("#non-adherent-button").on('click', function (x) {
        console.log(x);
        sendResponse(i, false);
    });

}

module.exports = {
    showViz: showViz,
    getData : getData,
    sendResponse : sendResponse
};


