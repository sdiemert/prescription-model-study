/**
 * Created by sdiemert on 2016-01-28.
 */

var SVGFactory = require("../front/SVGFactory");
var Factory = require("../shared/Factory");
var SVG = require("../front/svgUtil");

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
function _drawTimelines(canvas, data){
    var Ts = Factory.createTimelines(data, "day");
    for(var i = 0; i < Ts.length; i++){
        $(canvas).append(SVGFactory.getTimelineAsSVGGroup(Ts[i], 300*(i+1)));
    }
}

function showViz(err, data) {

    if (err) {
        console.log("ERROR:");
        console.log(err);
    }

    _dataPreprocessor(data);

    var wrapper = $("#wrapper");
    var canvas = SVG.makeSVG('canvas', 1000, 800);

    wrapper.append(canvas);
    
    console.log(data);
    
    _drawTimelines(canvas, data.slice(1,11));

}

module.exports = {
    showViz : showViz
};


