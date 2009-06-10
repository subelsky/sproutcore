// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Apple, Inc. and contributors.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var store, Foo, json, foo ;
module("SC.Record#writeAttribute", {
  setup: function() {
    store = SC.Store.create();
    Foo = SC.Record.extend();
    json = { 
      foo: "bar", 
      number: 123,
      bool: YES,
      array: [1,2,3] 
    };
    
    foo = store.createRecord(Foo, json);
    store.writeStatus(foo.storeKey, SC.Record.READY_CLEAN); 
  }
});

test("returns receiver", function() {
  equals(foo.writeAttribute("bar", "baz"), foo, 'should return receiver');
});

test("first time writing should mark record as dirty", function() {
  // precondition
  equals(foo.get('status'), SC.Record.READY_CLEAN, 'precond - start clean');

  // action
  foo.writeAttribute("bar", "baz");

  // evaluate
  equals(foo.get('status'), SC.Record.READY_DIRTY, 'should make READY_DIRTY after write');
});

test("state change should be deferred if writing inside of a beginEditing()/endEditing() pair", function() {

  // precondition
  equals(foo.get('status'), SC.Record.READY_CLEAN, 'precond - start clean');

  // action
  foo.beginEditing();
  foo.writeAttribute("bar", "baz");

  equals(foo.get('status'), SC.Record.READY_CLEAN, 'should not change state yet');

  foo.endEditing();

  // evaluate
  equals(foo.get('status'), SC.Record.READY_DIRTY, 'should make READY_DIRTY after write');
  
}) ;

test("raises exception if you try to write an attribute before an attribute hash has been set", function() {
  store.removeDataHash(foo.storeKey);
  equals(store.readDataHash(foo.storeKey), null, 'precond - should not have store key');
  
  var e, cnt=0 ;
  try {
    foo.writeAttribute("foo", "bar");
  } catch(e) {
    equals(e, SC.Record.BAD_STATE_ERROR, 'should throw BAD_STATE_ERROR');
    cnt++;
  }
  equals(cnt, 1, 'should raise exception');
});

