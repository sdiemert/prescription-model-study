/**
 * Created by sdiemert on 2016-01-28.
 */

/**
 * 
 * @param data {Array}
 */
function dataPreprocessor(data){
    
    for(var i = 0; i < data.length; i++){
        data[i].datetime = new Date(data[i].datetime); 
    }
}

/**
 * 
 * @param canvas {object}
 * @param data {Timeline[]}
 */
function drawTimelines(canvas, data){
    var Ts = createTimelines(data, "day");
    for(var i = 0; i < Ts.length; i++){
        $(canvas).append(getTimelineAsSVGGroup(Ts[i], 300*(i+1)));
    }
}

function showViz(err, data) {

    if (err) {
        console.log("ERROR:");
        console.log(err);
    }

    dataPreprocessor(data);

    var wrapper = $("#wrapper");
    var canvas = makeSVG('canvas', 1000, 800);

    wrapper.append(canvas);
    
    console.log(data);
    
    drawTimelines(canvas, data.slice(1,11));

}


