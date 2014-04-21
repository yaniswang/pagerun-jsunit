(function(win){
    if (win.YUITest === undefined || win.pagerun === undefined) {
        return;
    }
    pagerun.waitMe();
    var TestRunner = YUITest.TestRunner;
    var suiteName, testStartTime;

    function logEvent(event) {
        var results = event.results;;
        switch (event.type) {
        case TestRunner.BEGIN_EVENT:
            pagerun.result('yuitest.begin', 'Begin of the TestRunner.');
            break;
        case TestRunner.TEST_SUITE_BEGIN_EVENT:
            suiteName = event.testSuite.name;
            pagerun.result('yuitest.suiteStart', suiteName);
            break;
        case TestRunner.TEST_CASE_BEGIN_EVENT:
            testStartTime = new Date().getTime();
            pagerun.result('yuitest.caseStart', event.testCase.name);
            break;
        case TestRunner.TEST_PASS_EVENT:
            pagerun.result('yuitest.log', {
                result: true,
                message: event.testName
            });
            break;
        case TestRunner.TEST_FAIL_EVENT:
            var error = event.error;
            pagerun.result('yuitest.log', {
                result: false,
                message: event.testName + ': ' + error.message,
                actual: error.actual,
                expected: error.expected
            });
            break;
        case TestRunner.TEST_CASE_COMPLETE_EVENT:
            pagerun.result('yuitest.caseComplete', {
                suiteName: suiteName,
                caseName: results.name,
                total: results.total,
                passed: results.passed,
                failed: results.failed,
                errors: results.errors,
                ignored: results.ignored,
                duration: results.duration
            });
            break;
        case TestRunner.TEST_SUITE_COMPLETE_EVENT:
            pagerun.result('yuitest.suiteComplete', {
                name: results.name,
                total: results.total,
                passed: results.passed,
                failed: results.failed
            });
            break;
        case TestRunner.COMPLETE_EVENT:
            pagerun.result('yuitest.complete', {
                total: results.total,
                passed: results.passed,
                failed: results.failed,
                runtime: results.duration
            });
            pagerun.end();
            break;
        }
    }
    TestRunner.attach(TestRunner.BEGIN_EVENT, logEvent);
    TestRunner.attach(TestRunner.COMPLETE_EVENT, logEvent);
    TestRunner.attach(TestRunner.TEST_CASE_BEGIN_EVENT, logEvent);
    TestRunner.attach(TestRunner.TEST_CASE_COMPLETE_EVENT, logEvent);
    TestRunner.attach(TestRunner.TEST_SUITE_BEGIN_EVENT, logEvent);
    TestRunner.attach(TestRunner.TEST_SUITE_COMPLETE_EVENT, logEvent);
    TestRunner.attach(TestRunner.TEST_PASS_EVENT, logEvent);
    TestRunner.attach(TestRunner.TEST_FAIL_EVENT, logEvent);
    TestRunner.attach(TestRunner.TEST_IGNORE_EVENT, logEvent);
})(window);