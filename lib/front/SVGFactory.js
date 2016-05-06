/**
 * Created by sdiemert on 2016-05-05.
 */

var SVG = require("./svgUtil");

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
    var EVENT_V_DIST = RECT_H*1.5;
    var RECT_BACKBONE_SEP = 20; 
    var ICON_SIZE = 45; 
    
    // backbone of line
    g.append(
        SVG.makeLine(null, x, y, x,
            y-((events.length-1) * EVENT_V_DIST+50),
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
                 SVG.makeCircle(null, x-RECT_BACKBONE_SEP*2.5, tmpY-ICON_SIZE/2, 30, "white", 'black')
             );
            
             g.append(
                SVG.makeImage(null,
                    events[i].getImage(),
                    x-RECT_BACKBONE_SEP*2.5 - ICON_SIZE/2 , tmpY-ICON_SIZE ,
                    45, 45 
                )
            );
        }
        
        
    }
    
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
