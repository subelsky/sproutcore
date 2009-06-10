// ========================================================================
// SC.Request Base Tests
// ========================================================================
/*globals module test ok isObj equals expects */

var url, request, contents ;

module("SC.Request", {
  
  setup: function() {
    url = sc_static("file_exists.json"); //"/static/sproutcore/en/desktop/_src/desktop.platform/english.lproj/file_exists.json" ;
    request = SC.Request.getUrl(url) ;
    contents = null ;
  },
  
  teardown: function() {
    delete url ;
    delete request ;
    delete contents ;
  }
  
});

test("Basic Requirements", function() {
  ok(SC.Request, "SC.Request is defined") ;
  ok("" != url, "url variable is not empty") ;
  ok(request !== null, "request object is not null") ;
  ok(contents === null, "contents is null" ) ;
});

test("Test Asynchronous GET Request", function() {
  request.addObserver("response", function(response) {
      contents = request.get("response") ;
  });
  
  request.send() ;
  
  stop() ; // stops the test runner
  setTimeout( function(){
    ok(contents !== null, 'request.send() should return a response') ;
    ok(SC.$ok(contents), 'contents should not be an error (Error: %@)'.fmt(contents));
    
    if (SC.$ok(contents)) equals(contents, '{"message": "Yay!"}', "should match retrieved message") ;
    window.start() ; // starts the test runner
  }, 3000); // a shorter timeout fails when a lot of unit tests are running...
});

test("Test Synchronous GET Request", function() {
  request.set("isAsynchronous", NO);
  
  request.send();
  
  contents = request.get("response");
  
  ok(contents !== null) ;
  ok(SC.$ok(contents), 'contents should not be an error (Error: %@)'.fmt(contents));
  if (SC.$ok(contents)) equals(contents, '{"message": "Yay!"}', 'should match retrieved message') ;
});

test("Test Asynchronous GET Request, auto-deserializing JSON", function() {
  request.set("isJSON", YES);
  
  request.addObserver("response", function(response){
      contents = request.get("response");
  });
  
  request.send();
  
  stop() ; // stops the test runner
  setTimeout( function(){
    ok(contents !== null) ;
    ok(SC.$ok(contents), 'contents should not be an error (Error: %@)'.fmt(contents));
    if (SC.$ok(contents)) same({"message": "Yay!"}, contents) ;
    window.start() ; // starts the test runner
  }, 1000);
});

test("Test Synchronous GET Request, auto-deserializing JSON", function() {
  request.set("isAsynchronous", false);
  request.set("isJSON", true);
  
  request.send();
  
  var contents = request.get("response");
  
  ok(contents !== null, 'contents should not be null') ;
  ok(SC.$ok(contents), 'contents should not be an error (contents = %@)'.fmt(contents));
  if (SC.$ok(contents)) same(contents, {"message": "Yay!"}, 'contents should have message') ;
});


test("Test if Request body is being auto-serializing to JSON", function() {
  request.set("isAsynchronous", false);
  request.set("isJSON", true);
  var objectToPost={"content": "garbage"};
  
  request.send(objectToPost);
  var jsonEncoded = request.get('body');
  var contents = request.get("response");
  
  equals(jsonEncoded, '{"content":"garbage"}', "The json object passed in send should be encoded and set as the body");
});


test("Test Multiple Asynchronous GET Request - two immediate, and two in serial", function() {
  var requestCount = 3;
  var responseCount = 0;

  var observer = function(response) {
    responseCount++;
    if(requestCount<=7) {
      SC.Request.getUrl(url).addObserver("response", observer).send();
      requestCount++;
    }
  };
  
  
  SC.Request.getUrl(url).notify(this, observer).send();
  SC.Request.getUrl(url).notify(this, observer).send();
  SC.Request.getUrl(url).notify(this, observer).send();
  
  stop() ; // stops the test runner
  setTimeout( function(){
    equals(requestCount, 8, "requestCount should be 4");
    equals(responseCount, 6, "responseCount should be 4");
    window.start() ; // starts the test runne
  }, 3000);
});

