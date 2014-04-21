var fs = require('fs');

module.exports = function(pagerun){
    var self = this;
    var bOpenUrl = false;
    pagerun.on('proxyStart', function(msg){
        var proxy = msg.proxy;
        var jsunitPath = 'http://pagerun/jsunit/';
        // Mocha
        var adapterMochaContent = fs.readFileSync(__dirname+'/jsunit-adapter-mocha.js');
        var scriptMocha = '<script type="text/javascript" src="'+jsunitPath+'adapter_mocha.js" charset="utf-8"></script>';
        // Jasmine
        var adapterJasmineContent = fs.readFileSync(__dirname+'/jsunit-adapter-jasmine.js');
        var scriptJasmine = '<script type="text/javascript" src="'+jsunitPath+'adapter_jasmine.js" charset="utf-8"></script>';
        //QUnit
        var adapterQunitContent = fs.readFileSync(__dirname+'/jsunit-adapter-qunit.js');
        var scriptQunit = '<script type="text/javascript" src="'+jsunitPath+'adapter_qunit.js" charset="utf-8"></script>';
        //YUITest
        var adapterYuitestContent = fs.readFileSync(__dirname+'/jsunit-adapter-yuitest.js');
        var scriptYUITest = '<script type="text/javascript" src="'+jsunitPath+'adapter_yuitest.js" charset="utf-8"></script>';
        proxy.addFilter(function(httpData, next, end){
            if(bOpenUrl === true){
                var responseContent = httpData.responseContent;
                if(httpData.responseCode === 200 &&
                    httpData.responseType === 'html' &&
                    responseContent !== undefined){
                    httpData.responseContent = responseContent.replace(/<script(\s+[^<>]*)?>\s*<\/script>/ig,function(all, attrs){
                        if(/src\s*=\s*['"][^'"]*jasmine-html\.js[\?'"]/i.test(attrs)){
                            all += scriptJasmine;
                        }
                        else if(/src\s*=\s*['"][^'"]*qunit(\-\d+\.\d+\.\d+)?\.js[\?'"]/i.test(attrs)){
                            all += scriptQunit;
                        }
                        else if(/src\s*=\s*['"][^'"]*yuitest(\-min)?\.js[\?'"]/i.test(attrs)){
                            all += scriptYUITest;
                        }
                        else if(/src\s*=\s*['"][^'"]*mocha(\-\d+\.\d+\.\d+)?\.js[\?'"]/i.test(attrs)){
                            all += scriptMocha;
                        }
                        return all;
                    });
                }
                else if(httpData.type === 'request' && httpData.hostname === 'pagerun'){
                    switch(httpData.path){
                        case '/jsunit/adapter_mocha.js':
                            httpData.responseCode = '200';
                            httpData.responseHeaders = {
                                'Content-Type': 'application/javascript'
                            };
                            httpData.responseData = adapterMochaContent;
                            break;
                        case '/jsunit/adapter_jasmine.js':
                            httpData.responseCode = '200';
                            httpData.responseHeaders = {
                                'Content-Type': 'application/javascript'
                            };
                            httpData.responseData = adapterJasmineContent;
                            break;
                        case '/jsunit/adapter_qunit.js':
                            httpData.responseCode = '200';
                            httpData.responseHeaders = {
                                'Content-Type': 'application/javascript'
                            };
                            httpData.responseData = adapterQunitContent;
                            break;
                        case '/jsunit/adapter_yuitest.js':
                            httpData.responseCode = '200';
                            httpData.responseHeaders = {
                                'Content-Type': 'application/javascript'
                            };
                            httpData.responseData = adapterYuitestContent;
                            break;
                    }
                    if(httpData.responseCode){
                        return end();
                    }
                }
            }
            next();
        });
    });
    pagerun.on('webdriverOpenUrl', function(){
        bOpenUrl = true;
    });
};