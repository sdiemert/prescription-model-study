/**
 * Created by sdiemert on 2016-05-05.
 */

var SVG = require("./svgUtil");

var Event = require("../shared/Event");

/**
 * @param d {Date}
 * @private
 * @returns {string}
 */
function _makeDateString(d){
    
    return (d.getHours() > 9 ? d.getHours(): "0"+d.getHours())+":"+(d.getMinutes() > 9 ? d.getMinutes() : "0"+d.getMinutes()); 
    
}

function _makeDayAxis(id, vStart){

    var g = $(SVG.makeGroup());
    g.append(SVG.makeLine(id, 20, vStart, 1000 - 20, vStart, "black", 2));

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
    
    var RECT_W = 120;
    var RECT_H = 30;
    var EVENT_V_DIST = RECT_H*1.6;
    var RECT_BACKBONE_SEP = 20; 
    var ICON_SIZE = 30;

    events.sort(function(x,y){

        if(!(x instanceof Event.FoodEvent) && y instanceof Event.AdministrationEvent) return 1;
        else if(!(y instanceof Event.FoodEvent) && x instanceof Event.AdministrationEvent) return -1;
        else return 0;
    });
    
    // backbone of line
    g.append(
        SVG.makeLine(null, x, y, x,
            y-((events.length) * EVENT_V_DIST+50),
            "black", 1)
    );
    
    
    for(var i = 0; i < events.length; i++){
        
        var tmpY = y-((i)*EVENT_V_DIST + 50);

        g.append(
            SVG.makeLine(null,
                x, tmpY, 
                x - RECT_BACKBONE_SEP, tmpY-RECT_BACKBONE_SEP,
                "black", 1
            )
        );
        
        if(events[i].getText()) {
            g.append(
               SVG.makeRoundedRect(null,
                    x-RECT_BACKBONE_SEP-RECT_W, tmpY-RECT_H,
                    RECT_W, RECT_H,
                    5, "#e5e5e5", "black", 1
                )
            );
            g.append(
                SVG.makeText(null,
                    x - RECT_BACKBONE_SEP - RECT_W + (RECT_W / 8), tmpY - RECT_H + (RECT_H / 2 + 3),
                    events[i].getText(), 12
                )
            );
        }else if(events[i].getImage()){
            
             g.append(
                 SVG.makeCircle(null, 
                     x-RECT_BACKBONE_SEP*2.0, tmpY-ICON_SIZE*0.70, 
                     ICON_SIZE*0.7, "#e6e6e6", 'black'
                 )
             );
            
             g.append(
                SVG.makeImage(null,
                    events[i].getImage(),
                    x-RECT_BACKBONE_SEP*2.0 - ICON_SIZE/2 , tmpY-ICON_SIZE*1.2,
                    ICON_SIZE, ICON_SIZE 
                )
            );
        }
        
    }

    g.append(
        SVG.makeRoundedRect(null,
            x-RECT_W/4, y-((events.length) * EVENT_V_DIST+50+RECT_H),
            RECT_W/2, RECT_H,
            5, "#e5e5e5", "black", 1
        )
    );
    g.append(
        SVG.makeText(null,
            x-18, tmpY-RECT_H*1.9,
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

    g.append(SVG.makeCircle(null, x, vOffset, 5, 'blue', 'black'));
    

    g.mouseenter(function(){
        g.children("circle").attr("r", 8);
        g.append(_makeCallOutBox(events, x, vOffset));
    });

    g.mouseleave(function(){
        g.children("circle").attr("r", 5);
        g.children("g").remove();
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
    
   var g = $(SVG.makeGroup());
    g.append(_makeDayAxis(null, vOffset));
    
    var clusters = T.clusterEvents(15 * 60); //15 min clusters
    
    for(var i = 0; i < clusters.length; i++){
        g.append(_makeEventMark(125, vOffset, clusters[i]));
    }
    
    return g;
    
}

module.exports = {
    getTimelineAsSVGGroup : getTimelineAsSVGGroup   
};
