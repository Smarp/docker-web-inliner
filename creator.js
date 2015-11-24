var inliner = require("web-resource-inliner")
var request = require('request')
var fs = require('fs')
var url = require('url')
var inliner2 = require('inliner');

var fetch = process.argv[2]
var host = url.parse(fetch).hostname

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
        }).on('response', function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });
  
  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    inliner.html({fileContent: str,
                  relativeTo: host}, function(err, data){
                                       console.log(err)
                                       fs.writeFileSync('test.html', str)
                                       fs.writeFileSync('inlined_test.html', data)
                                       
                                       
                                     }
                 
                )
  }
             )
})