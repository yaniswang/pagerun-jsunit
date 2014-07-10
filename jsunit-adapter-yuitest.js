pagerun.newTask('jsunit', function(){
    var win = window;
    var task = this;
    if (win.YUITest === undefined || win.pagerun === undefined) {
        return;
    }
    var TestRunner = YUITest.TestRunner;
    var suiteName, testStartTime;

    function logEvent(event) {
        var results = event.results;;
        switch (event.type) {
        case TestRunner.BEGIN_EVENT:
            task.info({
                'type': 'yuitest.begin',
                'url': location.href
            });
            break;
        case TestRunner.TEST_SUITE_BEGIN_EVENT:
            suiteName = event.testSuite.name;
            task.info({
                'type': 'yuitest.suiteStart',
                'suiteName': suiteName
            });
            break;
        case TestRunner.TEST_CASE_BEGIN_EVENT:
            testStartTime = new Date().getTime();
            task.info({
                'type': 'yuitest.caseStart',
                'caseName': event.testCase.name
            });
            break;
        case TestRunner.TEST_PASS_EVENT:
            task.info({
                'type': 'yuitest.log',
                'result': true,
                'message': event.testName
            });
            break;
        case TestRunner.TEST_FAIL_EVENT:
            var error = event.error;
            task.info({
                'type': 'yuitest.log',
                'result': false,
                'message': event.testName + ': ' + error.message,
                'actual': error.actual,
                'expected': error.expected
            });
            break;
        case TestRunner.TEST_CASE_COMPLETE_EVENT:
            task.info({
                'type': 'yuitest.caseComplete',
                'suiteName': suiteName,
                'caseName': results.name,
                'total': results.total,
                'passed': results.passed,
                'failed': results.failed,
                'errors': results.errors,
                'ignored': results.ignored,
                'duration': results.duration
            });
            break;
        case TestRunner.TEST_SUITE_COMPLETE_EVENT:
            task.info({
                'type': 'yuitest.suiteComplete',
                'name': results.name,
                'total': results.total,
                'passed': results.passed,
                'failed': results.failed
            });
            break;
        case TestRunner.COMPLETE_EVENT:
            task.info({
                'type': 'yuitest.complete',
                'total': results.total,
                'passed': results.passed,
                'failed': results.failed,
                'runtime': results.duration
            });
            task.end();
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
});