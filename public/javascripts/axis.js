/**
 * Created by sdiemert on 2016-01-28.
 */

var colors = {blue : "#80bfff", blueStrong : "#4da6ff", grey : "#e8e8e8", greyStrong : "#999999"};

var CIRCLE_RAD = 20;

var div = d3.select("#details-box");

var moveRight = null;

function scrollItRight(){

    var w = $("#wrapper");

    console.log(w);
    console.log(w.offset());

    w.animate({
        scrollLeft : '+=100'
    }, 250);

}

function scrollItLeft(){

    var w = $("#wrapper");

    console.log(w);
    console.log(w.offset());

    w.animate({
        scrollLeft : '-=100'
    }, 250);

}


function toolTipMouseOver(d, div, color) {

    if (typeof d.date !== "object") {
        d.date = new Date(d.date * 1000);
    }

    var s = "<b>Day:</b> " + d.date.getDate() + "<br>";
    s += "<b>Time:</b> " + d.date.getHours() + ":"+d.date.getMinutes()+(d.date.getMinutes()<10?'0':'')+"<br>";
    s += "<b>Dose:</b> " + d.dose + " "+d.units+"<br>";
    s += "<b>Substance:</b> "+d.substance+"<br>";

    div.html(s);

    svg.select("#point-"+d.id+" > circle").transition()
        .duration(100)
        .attr("r", CIRCLE_RAD+2)
        .attr("stroke", colors.greyStrong)
        .attr("fill", colors.blueStrong);

    svg.select("#point-"+d.id+" > text").transition()
        .duration(100)
        .style("font-weight", "bold");

}
function toolTipMouseOut(d, div) {

    div.text("");
    svg.select("#point-"+d.id+" > circle").transition()
        .duration(100)
        .attr("r", CIRCLE_RAD)
        .attr("stroke", colors.grey)
        .attr("fill", colors.blue);

    svg.select("#point-"+d.id+" > text").transition()
        .duration(100)
        .style("font-weight", "normal");

}

var margin = {top: 20, right: 70, bottom: 30, left: 30},
    width  = 2000 - margin.left - margin.right,
    height = 225 - margin.top - margin.bottom;

function massageObjects(d) {
    d.date = formatDate.parse(d.datetime);
    d.y    = 0;
    return d;
}
var formatDate = d3.time.format("%Y-%m-%d %H:%M");
var outFormat  = d3.time.format("%d");

var xScale = d3.time.scale();

var yScale = d3.scale.linear().domain([0, 0]).range([0, 0]);

var axis = d3.svg.axis()
    .scale(xScale)
    .tickFormat(outFormat)
    .ticks(d3.time.day)
    .tickSize(20, 15);

var yaxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var svg = d3.select("#wrapper").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top)
    .append("g")
    .attr("transform", "translate(" + margin.left + ",100)");

function showViz(err, data) {

    if (err) {
        console.log("ERROR:");
        console.log(err);
    }

    for(var i = 0; i < data.length; i++){

        data[i] = massageObjects(data[i]);
        data[i].id = i;

    }

    // Set data for xScale
    xScale.domain(d3.extent(data, function (d) {
            var tmp = new Date(d.date);
            tmp.setMinutes(0);
            tmp.setHours(0);
            tmp.setSeconds(0);
            tmp.setMilliseconds(0);
            return tmp;
        })
    );

    // Set the size of the xScale
    // adjust to have a varying size.
    xScale.range([0, width]);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, " + margin.top + ")")
        .call(axis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
        .call(yaxis);

    var points = svg.append("g");

    var elemEnter = points.selectAll("g")
        .data(data).enter()
        .append("g")
        .style("z-index", 1)
        .attr("transform", function(d){
            return "translate("+xScale(d.date) +","+CIRCLE_RAD+")";
        })
        .attr("id", function(d){return "point-"+d.id;})
        .on("mouseover" , function(d){
           toolTipMouseOver(d, div, null);
        })
        .on("mouseout", function(d){
            toolTipMouseOut(d, div, null);
        });

    var circle = elemEnter.append("circle")
        .attr("r", CIRCLE_RAD)
        .attr("stroke", colors.grey)
        .attr("fill", colors.blue);

    var t = elemEnter.append("text")
        .attr("dx", function(d){
            if(d.dose < 10) return -4;
            else if(d.dose < 100) return -8;
            else if(d.dose < 1000) return -12;
            else return -15;
        })
        .attr("dy", "5")
        .text(function(d){return d.dose});

    // Move the text below the axis and to the right of
    // the tick.
    svg.selectAll(".tick text")
        .style("text-anchor", "start")
        .attr("x", -8)
        .attr("y", 25);

}


