var assert = require( "assert" );
var fs = require( "fs" );
var path = require( "path" );
var inline = require( "../src/inline.js" );
var fauxJax = require( "faux-jax" );
var mime = require( "mime-types" );

function normalize( contents )
{
    return process.platform === "win32" ? contents.replace( /\r\n/g, "\n" ) : contents;
}

function readFile( file )
{
    return normalize( fs.readFileSync( file, "utf8" ) );
}

function diff( actual, expected )
{
    if( actual === expected )
    {
        return;
    }

    actual = actual.split( "\n" );
    expected = expected.split( "\n" );

    expected.forEach( function( line, i )
    {
        if( !line.length && i === expected.length - 1 )
        {
            return;
        }
        var other = actual[ i ];
        if( line === other )
        {
            console.error( "%d| %j", i + 1, line );
        }
        else
        {
            console.error( "\033[31m%d| %j%s | %j\033[0m", i + 1, line, "", other );
        }
    } );
}

function testEquality( err, result, expected, done )
{
    result = normalize( result );
    diff( ""+result, ""+expected );
    assert( !err );
    assert.equal( result, expected );
    done();
}

describe( "html", function()
{

    it( "should return empty string when no html nor request url is passed ", function( done )
    {
        inline.inline({}.a,
		      {}.a,
            
            function( err, result )
            {
                testEquality( err, result.InlinedHtml, "", done );
            }
        );
    } );

    it( "should return valid html when valid html and no request url is sent", function( done )
    {
        var expected = readFile( "test/cases/valid.html" );
        inline.inline(expected,
		      {}.a,
            function( err, result )
            {
                testEquality( err, result.InlinedHtml, expected, done );
            }
        );
    } );

    it( "should return valid html when valid html and malformed url is sent", function( done )
    {	
        var expected = readFile( "test/cases/valid.html" );
	inline.inline(expected,
               "asdfasdfwfdfsdasdfasdf.s.fwoes.e.nsdos/!231z",
            function( err, result )
            {
                testEquality( err, result.InlinedHtml, expected, done );
            }
        );
    } );

    it( "should return valid html when valid html and correct request url are sent", function( done )
    {
        var expected = readFile( "test/cases/valid.html" );
	
        inline.inline(expected,
               "test/case/",
            function( err, result )
            {
                testEquality( err, result.InlinedHtml, expected, done );
            }
        );
    } );
    
    it( "should return garbage when garbage html is sent", function( done )
    {
        var expected = readFile( "test/cases/invalid.html" );
	
        inline.inline(expected,
               "test/case/",
            function( err, result )
            {
                testEquality( err, result.InlinedHtml, expected, done );
            }
        );
    } );
} );
