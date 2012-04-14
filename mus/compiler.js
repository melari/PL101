var endTime = function(t, expr) {
    if (expr.tag == "repeat") { return endTime(t, expr.section) * expr.count; }
    if (expr.tag == "rest") { return t + expr.dur; }
    if (expr.tag == "note") { return t + expr.dur; }
    if (expr.tag == "seq") { return endTime(endTime(t, expr.left), expr.right); }
    return Math.max(endTime(t, expr.left), endTime(t, expr.right));
};

var convertPitch = function(pitch) {
    var letterPitch = 0;
    if (pitch[0] == "a") { letterPitch = 10; }
    else if (pitch[0] == "b") { letterPitch = 11; }
    else { letterPitch = pitch.charCodeAt(0) - 97; }
    
    return 12 + 12 * parseInt(pitch[1]) + letterPitch;
};

var compileT = function(t, expr) {
    if (expr.tag == "repeat") {
        console.log("REPEAT");
        var res = [];
        for (var i = 0; i < expr.count; i++) {
            res = res.concat(compileT(t+endTime(0, expr.section)*i, expr.section));            
        }
        return res;
    }

    if (expr.tag == "rest") {
        console.log("REST");
        return [];
    }

    if (expr.tag == "note") {     
        console.log("NOTE");
        return [ { tag: "note",
                 pitch: convertPitch(expr.pitch),
                 start: t,
                   dur: expr.dur } ]; 
    }
    
    if (expr.tag == "seq") {
        console.log("SEQ");
        return compileT(t, expr.left).concat(compileT(endTime(t, expr.left), expr.right));
    }
        
    console.log("PAR");
    return compileT(t, expr.left).concat(compileT(t, expr.right));
};

var compile = function(expr) {
    return compileT(0, expr);
};


//TEST
var melody_mus =
{ tag: 'repeat',
  section:
    { tag: 'seq',
      left:
        { tag: 'par',
          left: { tag: 'note', pitch: 'a4', dur: 250 },
          right: { tag: 'note', pitch: 'b4', dur: 500 } },
      right:
        { tag: 'seq',
          left: { tag: 'rest', dur: 200 },
          right: { tag: 'note', pitch: 'd4', dur: 100 } } },
  count: 2 };
          
console.log(melody_mus);
console.log("\n");
console.log(compile(melody_mus));