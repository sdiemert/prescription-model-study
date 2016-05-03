/**
 * Created by sdiemert on 2016-01-28.
 */

var colors = {blue : "#80bfff", blueStrong : "#4da6ff", grey : "#e8e8e8", greyStrong : "#999999"};

var CIRCLE_RAD = 20;


/**
 * 
 * @param data {Array}
 */
function dataPreprocessor(data){
    
    for(var i = 0; i < data.length; i++){
        data[i].datetime = new Date(data[i].datetime); 
    }
}

function makeSVG(id, w, h){
    
    var e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    e.setAttribute('id', id);
    e.setAttribute('width',  w || 800);
    e.setAttribute('height', h || 400);
    e.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    return e;
    
}

function makeLine(id, x1, y1, x2, y2, color, stroke){

    var e = document.createElementNS("http://www.w3.org/2000/svg","line");
    e.setAttribute("x1", x1);
    e.setAttribute("y1", y1);
    e.setAttribute("x2", x2);
    e.setAttribute("y2", y2);
    e.setAttribute("id", id);
    

    e.style.stroke = color || "#000000";
    e.style.strokeWidth = stroke || 2; 
    
    return e; 

}

function makeText(id, x, y, text, size, rotate){

    var e = document.createElementNS("http://www.w3.org/2000/svg", "text");
    e.setAttribute("x", x);
    e.setAttribute("y", y);
    e.setAttribute("id", id);
    e.setAttribute("font-size", size || 14);
    e.setAttribute("font-family", "Verdana");
    e.setAttribute("style", "fill:'black'; stroke: 'black';");
    
    if(rotate){
        e.setAttribute("transform", "rotate("+rotate+", "+x+","+y+")");
    }
    
    e.innerHTML = text; 
    
    return e; 
}

function makeDayAxis(id, start){
    
    var g = $(document.createElementNS("http://www.w3.org/2000/svg","g"));
    g.append(makeLine(id, 20, start, 1000 - 20, start, "black", 2));

    var tickX = 0;
    var tickId = ""; 
    
    var innerGroup = null; 
    
    for(var i = 0; i <= 24; i=i+4){
        
        tickX = 20+(i*40);
        tickId = id+'-tick'+i;
        
        innerGroup = $(document.createElementNS("http://www.w3.org/2000/svg","g"));
        innerGroup.append(makeLine(tickId, tickX, start-5, tickX, start+5, "black", 2));
        innerGroup.append(makeText(tickId + "-label", tickX-15, start+20, ""+i+":00", 14, 45));
        
        g.append(innerGroup);

    }
    
    return g;
}

/**
 * 
 * @param canvas {object}
 * @param events {array}
 */
function drawSingleTimeline(canvas, events){


    $(canvas).append(makeDayAxis('timeline-1', 100));
    
}

function drawTimelines(canvas){

   drawSingleTimeline(canvas);

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
    
    drawTimelines(canvas);

}


