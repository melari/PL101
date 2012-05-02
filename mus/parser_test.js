console.log("running parser_test...");

var PEG = require("pegjs");
var assert = require("assert");
var fs = require("fs");

var data = fs.readFileSync("parser.peg", "utf-8");
var parse = PEG.buildParser(data).parse;

//empty file
assert.deepEqual( parse(""), "" );

//Single note
assert.deepEqual( parse("a5|250"), {tag:"note", pitch:"a5", dur:250} );

//sequence
assert.deepEqual( parse(": a5|250 b5|100"), 
  {
    tag:"seq",
    left: {tag:"note", pitch:"a5", dur:250}, 
    right: {tag:"note", pitch:"b5", dur:100} 
  }
);
assert.deepEqual( parse(": a5|250 : b5|100 c3|100"), 
  {
    tag:"seq", 
    left: {tag:"note", pitch:"a5", dur:250}, 
    right: 
    {
      tag:"seq",
      left: {tag:"note", pitch:"b5", dur:100},
      right: {tag:"note", pitch:"c3", dur:100} 
    } 
  }   
);

//Test parallels
assert.deepEqual( parse("+ a5|250 : b5|100 c3|100"), 
  {
    tag:"par", 
    left: {tag:"note", pitch:"a5", dur:250}, 
    right: 
    {
      tag:"seq",
      left: {tag:"note", pitch:"b5", dur:100},
      right: {tag:"note", pitch:"c3", dur:100} 
    } 
  }   
);

//Test repeats
assert.deepEqual( parse("rep 5 { a5|250}"), 
  {
    tag:"repeat", 
    section: {tag:"note", pitch:"a5", dur:250}, 
    count: 5 
  }   
);

//Test rests
assert.deepEqual( parse("-|250"), 
  {
    tag:"rest", 
    dur:250
  }   
);

//complex test
assert.deepEqual( parse("rep 2 { : + a4|250 b4|500 : -|200 d4|100 }"),
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
  count: 2 }  );

//Test Finish
console.log("OK\n");
