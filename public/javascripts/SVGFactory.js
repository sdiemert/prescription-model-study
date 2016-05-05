/**
 * Created by sdiemert on 2016-05-05.
 */

function _makeDayAxis(id, vStart){

    var g = $(makeGroup());
    g.append(makeLine(id, 20, vStart, 1000 - 20, vStart, "black", 2));

    var tickX = 0;
    var tickId = "";

    var innerGroup = null;

    for(var i = 0; i <= 24; i=i+4){

        tickX = 20+(i*40);
        tickId = id+'-tick'+i;

        innerGroup = $(makeGroup());
        innerGroup.append(makeLine(tickId, tickX, vStart-5, tickX, vStart+5, "black", 2));
        innerGroup.append(makeText(tickId + "-label", tickX-15, vStart+20, ""+i+":00", 14, 45));

        g.append(innerGroup);

    }

    return g;
}

/**
 *
 * @param hOffset {number}
 * @param vOffset {number}
 * @param event {Event}
 * @param event.datetime {Date}
 */
function _makeEventMark(hOffset, vOffset, event) {

    var x = _scaleDayToAxis(event.time, hOffset, 980);

    var g = $(makeGroup());

    g.append(makeCircle(null, x, vOffset, 5, 'blue'));
    g.append(makeLine(null, x, vOffset, x-10, vOffset-35, "black", 1));
    g.append(makeRoundedRect(null, x-40, vOffset-50, 30, 15, 5));

    g.mouseenter(function(x){
        g.children("circle").attr("r", 8);
        g.children("rect").attr("w", this.attr);
    });

    g.mouseleave(function(x){
        g.children("circle").attr("r", 5);
        g.children("circle").attr("r", 5);
    });
    
    return g; 

}

/**
 * Returns the position of the date on a scale defined by rangeMin and rangeMax
 * @param t {Date}
 * @param rangeMin {number}
 * @param rangeMax {number}
 */
function _scaleDayToAxis(t, rangeMin, rangeMax){

    // compute number of minutes in the day.
    var mins = t.getHours() * 60 + t.getMinutes();
    return Math.floor((mins/1440) * (rangeMax - rangeMin) + rangeMin);

}

/**
 * 
 * @param T {Timeline}
 * 
 * @return {object} an SVG group object containing the timeline.
 */
function getTimelineAsSVGGroup(T, vOffset){
    
    console.log(T);
    
   var g = $(makeGroup());
    g.append(_makeDayAxis(null, vOffset));
    
    for(var i = 0; i < T.events.length; i++){
        g.append(_makeEventMark(20, vOffset, T.events[i]));
    }
    
    return g;
    
}
