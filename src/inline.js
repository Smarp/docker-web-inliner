"use strict";

var inliner = require("web-resource-inliner")
var url = require('url')
var rpc = require('json-rpc2')

var errTextDebug = "<!--Error occurred while fetching ->\n"
var inliningErrorString = "error occured in inlining"

var rpcOptions = {
  'websocket': true, // is true by default 
  'headers': { // allow custom headers is empty by default 
    'Access-Control-Allow-Origin': '*'
  }
};

var server = new rpc.Server(rpcOptions);

function inline(html, reqUrl, callback){
  var time = (new Date()).getTime()
  try {
    var urlObj = url.parse(reqUrl);
  } catch (e) {
    console.warn("Malformed url", e)
  }
  if (!html){
    callback(null, {"InlinedHtml":""})
  } else {
    try {
      var relativeTo = urlObj.host ? urlObj.protocol + "//" + urlObj.hostname :  reqUrl ? reqUrl : ""
      inliner.html({fileContent: html,
                    relativeTo: relativeTo},
                   function(err, data){
                     if (err){
                       console.warn(inliningErrorString)
                       callback(err, {"InlinedHtml":html})
                     } else {
                       callback(err, {"InlinedHtml":data})
                     }
                   }
                  )
    } catch (err) {
      console.log(err)
      callback(err, {"InlinedHtml":html})
    }
  }
  
}

server.expose(process.env.MS_INLINER_METHOD, function (args, opt, callback) {
  inline(args[0].Html, args[0].ReqUrl, callback)
});

// listen creates an HTTP server on localhost only 
server.listenRaw(process.env.MS_INLINER_TCP_PORT, process.env.MS_INLINER_ADDRESS);
server.listen(process.env.MS_INLINER_HTTP_PORT, process.env.MS_INLINER_ADDRESS);
console.log("listening to tcp://"+process.env.MS_INLINER_ADDRESS+":"+ process.env.MS_INLINER_TCP_PORT+" and http://"+process.env.MS_INLINER_ADDRESS+":"+process.env.MS_INLINER_HTTP_PORT)
module.exports = {"inline": inline};