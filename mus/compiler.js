var endTime = function(t, expr) {
    if (expr.tag == "note") { return t + expr.dur; }
    if (expr.tag == "seq") { return endTime(endTime(t, expr.left), expr.right); }
    return Math.max(endTime(t, expr.left), endTime(t, expr.right));
};

var compileT = function(t, expr) {
    if (expr.tag == "note") {         
        return [ { tag: "note",
                 pitch: expr.pitch,
                 start: t,
                   dur: expr.dur } ]; 
    }
    
    if (expr.tag == "seq") {
        return compileT(t, expr.left).concat(compileT(endTime(t, expr.left), expr.right));
    }
        
    return compileT(t, expr.left).concat(compileT(t, expr.right));
};

var compile = function(expr) {
    return compileT(0, expr);
};