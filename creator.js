var inliner = require("web-resource-inliner")
var request = require('request')
var fs = require('fs')
var url = require('url')

var fetch = process.argv[2]
var host = url.parse(fetch).hostname
var errTextDebug = "<!--Error occurred while fetching ->\n"

request({uri: fetch,
         method: "GET",
         headers: {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:42.0) Gecko/20100101 Firefox/42.0",
                   "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                   "Accept-Language": "en-US,en;q=0.5",
                   "Connection": "keep-alive",
                   "Accept-Encoding": "text",
                   "Pragma": "no-cache",
                   "Cache-Control": "no-cache"
                  }
        }, function(error, response, body){
             if (error) {
               return console.error("Error: Could not fetch the given url. " + fetch)
             }
             inliner.html({fileContent: body,
                           relativeTo: host}, function(err, data){
                                                if (process.argv[3] == "-debug"){
                                                  if (err) {
                                                    return fs.writeFileSync('test.html',  errTextDebug + body)
                                                  } else {
                                                    return fs.writeFileSync('inlined_test.html', data)
                                                  }
                                                  
                                                } else {
                                                  if (err){
                                                    return console.log(body)
                                                  } else {
                                                    return console.log(data)
                                                  }
                                                  
                                                }
                                                
                                                
                                              }
                         )
           })