/**
 * Created by sdiemert on 2016-05-03.
 */

var SVGNameSpace = "http://www.w3.org/2000/svg";

function makeGroup() {
    return document.createElementNS(SVGNameSpace, "g");
}

/**
 *
 * @param id {string}
 * @param w {number}
 * @param h {number}
 * @returns {Element}
 */
function makeSVG(id, w, h) {

    var e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    e.setAttribute('id', id);
    e.setAttribute('width', w || 800);
    e.setAttribute('height', h || 400);
    e.setAttribute('xmlns', SVGNameSpace);
    return e;

}

/**
 *
 * @param id {string}
 * @param x1 {number}
 * @param y1 {number}
 * @param x2 {number}
 * @param y2 {number}
 * @param color {string}
 * @param stroke {number}
 * @returns {Element}
 */
function makeLine(id, x1, y1, x2, y2, color, stroke) {

    var e = document.createElementNS(SVGNameSpace, "line");
    e.setAttribute("x1", x1);
    e.setAttribute("y1", y1);
    e.setAttribute("x2", x2);
    e.setAttribute("y2", y2);
    e.setAttribute("id", id);


    e.style.stroke      = color || "#000000";
    e.style.strokeWidth = stroke || 2;

    return e;

}

/**
 *
 * @param id {string}
 * @param x {number}
 * @param y {number}
 * @param text {string}
 * @param size {number}
 * @param rotate {number}
 * @returns {Element}
 */
function makeText(id, x, y, text, size, rotate) {

    var e = document.createElementNS(SVGNameSpace, "text");
    e.setAttribute("x", x);
    e.setAttribute("y", y);
    e.setAttribute("id", id);
    e.setAttribute("font-size", size || 14);
    e.setAttribute("font-family", "Verdana");
    e.setAttribute("style", "fill:'black'; stroke: 'black';");

    if (rotate) {
        e.setAttribute("transform", "rotate(" + rotate + ", " + x + "," + y + ")");
    }

    e.innerHTML = text;

    return e;
}

/**
 *
 * @param id {string}
 * @param x {number}
 * @param y {number}
 * @param r {number}
 * @param color {string}
 */
function makeCircle(id, x, y, r, color) {
    var e = document.createElementNS(SVGNameSpace, "circle");
    e.setAttribute("cx", x);
    e.setAttribute("cy", y);
    e.setAttribute("r", r);
    e.setAttribute("id", id);
    e.setAttribute("style", "fill:" + color + ";");

    return e;

}

function makeImage(id, path, x, y, w, h){

    var e = document.createElementNS(SVGNameSpace, "image");

    e.setAttribute("xlink:href", path);
    e.setAttribute("x", x);
    e.setAttribute("y", y);
    e.setAttribute("width", w);
    e.setAttribute("height", h);
    e.setAttribute("id", id);
    
    return e; 

}

/**
 * 
 * @param id {string}
 * @param x {number}
 * @param y {number}
 * @param w {number}
 * @param h {number}
 * @param rounding {number}
 * @param color {string}
 * @param stroke {number}
 * @returns {Element}
 */
function makeRoundedRect(id, x, y, w, h, rounding, fill, line, stroke) {

    // rect x,y refer to top left corner 
    
    var e = document.createElementNS(SVGNameSpace, "rect");
    e.setAttribute("x", x);
    e.setAttribute("y", y);
    e.setAttribute("rx", rounding || 5);
    e.setAttribute("ry", rounding || 5);
    e.setAttribute("width", w);
    e.setAttribute("height", h);
    e.setAttribute("id", id);

    e.style.stroke      = line || "#000000";
    e.style.fill        = fill || "#ffffff";
    e.style.strokeWidth = stroke || 2;
    
    return e; 
}

module.exports = {
    makeRoundedRect : makeRoundedRect,
    makeLine : makeLine,
    makeCircle : makeCircle,
    makeImage : makeImage,
    makeText : makeText,
    makeSVG : makeSVG,
    makeGroup : makeGroup
};
