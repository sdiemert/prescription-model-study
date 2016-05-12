/**
 * Created by sdiemert on 2016-05-05.
 */

var SVG = require("./svgUtil");

var Event = require("../shared/Event");

var COLORS = { moon : "#a9c9e8", sun : "#fffcc0", food : "#c2e8ba", medication : "#ffffff", other : '#e8e8e8'};

/**
 * @param d {Date}
 * @private
 * @returns {string}
 */
function _makeDateString(d){
    
    return (d.getHours() > 9 ? d.getHours(): "0"+d.getHours())+":"+(d.getMinutes() > 9 ? d.getMinutes() : "0"+d.getMinutes()); 
    
}

function _makeDayAxis(id, vStart, num){

    var g = $(SVG.makeGroup());
    g.append(SVG.makeLine(id, 20, vStart, 1000 - 20, vStart, "black", 2));

    g.append(SVG.makeText(null, 20, vStart-50, "Day "+num, 16, 45));

    var tickX = 0;
    var tickId = "";

    var innerGroup = null;

    for(var i = 0; i <= 24; i=i+4){

        tickX = 20+(i*40);
        tickId = id+'-tick'+i;

        innerGroup = $(SVG.makeGroup());
        innerGroup.append(SVG.makeLine(tickId, tickX, vStart-5, tickX, vStart+5, "black", 2));
        innerGroup.append(SVG.makeText(tickId + "-label", tickX-15, vStart+20, ""+i+":00", 14, 45));

        g.append(innerGroup);

    }

    return g;
}

function _makeCallOutBox(events, x, y){

    var g = $(SVG.makeGroup());
    
    var RECT_W = 100;
    var RECT_H = 30;
    var EVENT_V_DIST = RECT_H*1.6;
    var RECT_BACKBONE_SEP = 20; 
    var ICON_SIZE = 30;

    var medEvents = events.filter(function(x){
        if(x instanceof Event.AdministrationEvent) return true; 
        else return false; 
    });
    
    // backbone of line
    g.append(
        SVG.makeLine(null, x, y, x,
            y-((medEvents.length) * EVENT_V_DIST+50),
            "black", 1)
    );
    
    for(var i = 0; i < medEvents.length; i++){
        
        var tmpY = y-((i)*EVENT_V_DIST + 50);
        
        var color = "#e5e5e5";
        
        if(events[i] instanceof Event.AdministrationEvent){
            color = COLORS.medication; 
        }else{
            continue; 
        }
        
        g.append(
            SVG.makeLine(null,
                x, tmpY, 
                x - RECT_BACKBONE_SEP, tmpY-RECT_BACKBONE_SEP,
                "black", 1
            )
        );
        
        g.append(
           SVG.makeRoundedRect(null,
                x-RECT_BACKBONE_SEP-RECT_W, tmpY-RECT_H,
                RECT_W, RECT_H,
                5, color, "black", 1
            )
        );
        g.append(
            SVG.makeText(null,
                x - RECT_BACKBONE_SEP - RECT_W + (RECT_W / 8), tmpY - RECT_H + (RECT_H / 2 + 3),
                events[i].getText(), 10
            )
        );

    }

    g.append(
        SVG.makeRoundedRect(null,
            x-RECT_W/4, y-((medEvents.length) * EVENT_V_DIST+50+RECT_H),
            RECT_W/2, RECT_H,
            5, COLORS.other, "black", 1
        )
    );
    
    g.append(
        SVG.makeText(null,
            x-18, y-medEvents.length*EVENT_V_DIST-RECT_H*2.0, 
            _makeDateString(events[0].time), 12
        )
    );
    
    return g; 
    
}


/**
 *
 * @param hOffset {number}
 * @param vOffset {number}
 * @param events {Event[]} events to be marked at the same time on the axis. 
 * @param events.datetime {Date}
 */
function _makeEventMark(hOffset, vOffset, events) {

    var x = _scaleDayToAxis(events[0].time, hOffset, 980);

    var g = $(SVG.makeGroup());

    var markFlag = false;
    
    g.append(_makeCallOutBox(events, x, vOffset));

    for(var i = 0; i < events.length; i++){

        if(events[i] instanceof Event.FoodEvent) {
            g.append(SVG.makeImageCircle(null, events[i].getImage(), x, vOffset, 15, COLORS.food));
            markFlag = true;
            break;
        } else if(events[i] instanceof Event.AwakeEvent) {
            g.append(SVG.makeImageCircle(null, events[i].getImage(), x, vOffset, 15, COLORS.sun));
            markFlag = true;
            break;
        }else if(events[i] instanceof Event.SleepEvent){
            g.append(SVG.makeImageCircle(null, events[i].getImage(), x, vOffset, 15, COLORS.moon));
            markFlag = true;
            break;
        }

    }

    if(!markFlag){
        g.append(SVG.makeCircle(null, x, vOffset, 5, 'black', 'black'));
    }


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
 * @param vOffset {number}
 * @param num {number}
 * 
 * @return {object} an SVG group object containing the timeline.
 */
function getTimelineAsSVGGroup(T, vOffset, num){
    
   var g = $(SVG.makeGroup());
    g.append(_makeDayAxis(null, vOffset, num));
    
    var clusters = T.clusterEvents(15 * 60); //15 min clusters
    
    for(var i = 0; i < clusters.length; i++){
        g.append(_makeEventMark(125, vOffset, clusters[i]));
    }
    
    return g;
    
}

module.exports = {
    getTimelineAsSVGGroup : getTimelineAsSVGGroup   
};
