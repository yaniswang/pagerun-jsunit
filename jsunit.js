var fs = require('fs');

module.exports = function(pagerun){
    var self = this;
    var bOpenUrl = false;
    pagerun.on('proxyStart', function(msg){
        var proxy = msg.proxy;
        proxy.addFilter(function(httpData, next, end){
            if(bOpenUrl === true){
                var jsunitPath = '//pagerun/jsunit/';
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
            }
            next();
        });
    });
    pagerun.on('webdriverOpenUrl', function(){
        bOpenUrl = true;
    });
    pagerun.addRequestMap('pagerun/jsunit/adapter_mocha.js', {
        'responseCode': '200',
        'responseHeaders': {
            'Content-Type': 'application/javascript'
        },
        'responseData': fs.readFileSync(__dirname+'/jsunit-adapter-mocha.js')
    });
    pagerun.addRequestMap('pagerun/jsunit/adapter_jasmine.js', {
        'responseCode': '200',
        'responseHeaders': {
            'Content-Type': 'application/javascript'
        },
        'responseData': fs.readFileSync(__dirname+'/jsunit-adapter-jasmine.js')
    });
    pagerun.addRequestMap('pagerun/jsunit/adapter_qunit.js', {
        'responseCode': '200',
        'responseHeaders': {
            'Content-Type': 'application/javascript'
        },
        'responseData': fs.readFileSync(__dirname+'/jsunit-adapter-qunit.js')
    });
    pagerun.addRequestMap('pagerun/jsunit/adapter_yuitest.js', {
        'responseCode': '200',
        'responseHeaders': {
            'Content-Type': 'application/javascript'
        },
        'responseData': fs.readFileSync(__dirname+'/jsunit-adapter-yuitest.js')
    });
};