/**
 * Created by sdiemert on 2016-01-28.
 */

var SVGFactory = require("../front/SVGFactory");
var Factory = require("../shared/Factory");
var SVG = require("../front/svgUtil");

const TIMELINE_HEIGHT = 180;

/**
 * 
 * @param data {Array}
 */
function _dataPreprocessor(data){
    
    for(var i = 0; i < data.length; i++){
        data[i].datetime = new Date(data[i].datetime); 
    }
}

/**
 * 
 * @param canvas {object}
 * @param data {Timeline[]}
 */
function _drawTimelines(data){

    var Ts = Factory.createTimelines(data, "day");

    var wrapper = $("#wrapper");
    var canvas = SVG.makeSVG('canvas', 1000, TIMELINE_HEIGHT*Ts.length+100);
    wrapper.append(canvas);
    
    for(var i = 0; i < Ts.length; i++){
        $(canvas).append(SVGFactory.getTimelineAsSVGGroup(Ts[i], TIMELINE_HEIGHT*(i+1), i+1));
    }
}

function showViz(err, data) {

    if (err) {
        console.log("ERROR:");
        console.log(err);
        return; 
    }

    _dataPreprocessor(data);
    _drawTimelines(data);

}

module.exports = {
    showViz : showViz
};


