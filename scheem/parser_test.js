console.log("running parser_test...");

var PEG = require("pegjs");
var assert = require("assert");
var fs = require("fs");

var data = fs.readFileSync("parser.peg", "utf-8");
var parse = PEG.buildParser(data).parse;

//empty file
assert.deepEqual( parse(""), "" );

//Single atom
assert.deepEqual( parse("atom"), "atom" );

//Atom List
assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );

//Generic Whitespace
assert.deepEqual( parse("(define  x\n10 \t   )"), ["define", "x", "10"] );

//Quote syntax
assert.deepEqual( parse("'x"), ["quote", "x"] );
assert.deepEqual( parse("'(1 2 3)"), ["quote", ["1", "2", "3"]] );

//comment syntax
assert.deepEqual( parse(";;this is  \ta ;comment!"), "" );
assert.deepEqual( parse(";;comment\na"), "a" );

//Test Finish
console.log("OK\n");
