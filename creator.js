var inliner = require("web-resource-inliner")
var request = require('request')
var fs = require('fs')
var url = require('url')
var htmlFile = process.argv[2]
var fetch = process.argv[3]
var host = url.parse(fetch).hostname
var errTextDebug = "<!--Error occurred while fetching ->\n"
var html = fs.readFileSync(htmlFile, {encoding: "utf8"})

var inliningErrorStirng = "error occured in inlining"

inliner.html({fileContent: html,
              relativeTo: host}, function(err, data){
                                   if (process.argv[3] == "-debug"){
                                     if (err) {
                                       console.warn(inliningErrorStirng)
                                       return console.log(errTextDebug + html)
                                     } else {
                                       return console.log(data)
                                     }
                                     
                                   } else {
                                     if (err){
                                       console.warn(inliningErrorStirng)
                                       return fs.writeFileSync(htmlFile+"-inlined",  errTextDebug + html)
                                     } else {
                                       return fs.writeFileSync(htmlFile+"-inlined",  data)
                                     }
                                     
                                   }
                                   
                                   
                                 }
            )
