/*
UNIT TESTS
*/
/*
getDate()
*/

QUnit.test( "Is current date test", function( assert ) {
  assert.ok( getDate(0).is_current === true, "Passed!" );
});

QUnit.test( "Is not current date test", function( assert ) {
  assert.ok( getDate(10).is_current !== true, "Passed!" );
});

/*
getWeekOfYear()
*/

QUnit.test( "Get week of year test", function( assert ) {
  var date = { "date": new Date(2017, 4, 2) };
  assert.ok( getWeekOfYear(date) === 18, "Passed!" );
});

/*
getNoteHeader()
*/

QUnit.test( "Get note header - start of month", function( assert ) {
  var date = buildDateObject(new Date(2017, 4, 1), 0);
  assert.ok( getNoteHeader(date) === '<hr /><h2>May</h2><hr /><p>Week 18</p>', "Passed!" );
});

QUnit.test( "Get note header - start of week", function( assert ) {
  var date = buildDateObject(new Date(2017, 5, 1), 0);
  assert.ok( getNoteHeader(date) === '<hr /><h2>June</h2>', "Passed!" );
});

QUnit.test( "Get note header", function( assert ) {
  var date = buildDateObject(new Date(2017, 4, 2), 0);
  assert.ok( getNoteHeader(date) === '', "Passed!" );
});

/*
getPanelClass()
*/

QUnit.test( "Get panel class default", function( assert ) {
  var date = buildDateObject(new Date(2017, 4, 20), 4);
  assert.ok( getPanelClass(date) === 'panel-default', "Passed!" );
});

QUnit.test( "Get panel class info", function( assert ) {
  var date = buildDateObject(new Date(2017, 4, 24), 1);
  assert.ok( getPanelClass(date) === 'panel-info', "Passed!" );
});

QUnit.test( "Get panel class primary", function( assert ) {
    var date = buildDateObject(new Date(2017, 4, 24), 0);
  assert.ok( getPanelClass(date) === 'panel-primary', "Passed!" );
});
