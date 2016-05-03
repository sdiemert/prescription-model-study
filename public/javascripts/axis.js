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

function makeGroup(){
   return document.createElementNS("http://www.w3.org/2000/svg","g");
}

function makeDayAxis(id, start){
    
    var g = $(makeGroup());
    g.append(makeLine(id, 20, start, 1000 - 20, start, "black", 2));

    var tickX = 0;
    var tickId = ""; 
    
    var innerGroup = null; 
    
    for(var i = 0; i <= 24; i=i+4){
        
        tickX = 20+(i*40);
        tickId = id+'-tick'+i;
        
        innerGroup = $(makeGroup());
        innerGroup.append(makeLine(tickId, tickX, start-5, tickX, start+5, "black", 2));
        innerGroup.append(makeText(tickId + "-label", tickX-15, start+20, ""+i+":00", 14, 45));
        
        g.append(innerGroup);

    }
    
    return g;
}

/**
 * Returns the position of the date on a scale defined by rangeMin and rangeMax
 * @param t {Date}
 * @param rangeMin {number}
 * @param rangeMax {number}
 */
function scaleDayToAxis(t, rangeMin, rangeMax){

    // compute number of minutes in the day.
    var mins = t.getHours() * 60 + t.getMinutes();
    return Math.floor((mins/1440) * (rangeMax - rangeMin) + rangeMin);

}

/**
 * 
 * @param id {string}
 * @param x {number}
 * @param y {number}
 * @param r {number}
 * @param color {string}
 */
function makeCircle(id, x, y, r, color){
    var e = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    e.setAttribute("cx", x);
    e.setAttribute("cy", y);
    e.setAttribute("r", r);
    e.setAttribute("id", id);
    e.setAttribute("style", "fill:"+color+";");
    
    return e; 

}

/**
 * 
 * @param hOffset {number}
 * @param vOffset {number}
 * @param event {object}
 * @param event.datetime {Date}
 */
function makeEventMark(hOffset, vOffset, event) {

    var x = scaleDayToAxis(event.datetime, hOffset, 980);

    return makeCircle(null, x, vOffset, 5, 'blue');

}
/**
 * 
 * @param canvas {object}
 * @param events {array}
 */
function drawSingleTimeline(canvas, events){

    var timeLineGroup = $(makeGroup());
    
    timeLineGroup.append(makeDayAxis('timeline-1', 100));
    
    
    for(var e = 0; e < events.length; e++){
        timeLineGroup.append(makeEventMark(20, 100, events[e]));
    }
    
    $(canvas).append(timeLineGroup);
    
     
    
}

function drawTimelines(canvas, data){

   drawSingleTimeline(canvas, data.slice(1, 6));

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
    
    drawTimelines(canvas, data);

}


