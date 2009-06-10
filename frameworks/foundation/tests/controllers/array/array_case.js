// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple, Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/*globals throws */

var content, controller, extra;

var TestObject = SC.Object.extend({
  title: "test",  
  toString: function() { return "TestObject(%@)".fmt(this.get("title")); }
});


// ..........................................................
// EMPTY
// 

module("SC.ArrayController - array_case - EMPTY", {
  setup: function() {
    content = [];
    controller = SC.ArrayController.create({ content: content });
    extra = TestObject.create({ title: "FOO" });
  },
  
  teardown: function() {
    controller.destroy();
  }
});

test("state properties", function() {
  equals(controller.get("hasContent"), YES, 'c.hasContent');
  equals(controller.get("canRemoveContent"), YES, "c.canRemoveContent");
  equals(controller.get("canReorderContent"), YES, "c.canReorderContent");
  equals(controller.get("canAddContent"), YES, "c.canAddContent");
});

// addObject should append to end of array + notify observers on Array itself
test("addObject", function() {
  var callCount = 0;
  controller.addObserver('[]', function() { callCount++; });
  
  SC.run(function() { controller.addObject(extra); });
  
  same(content, [extra], 'addObject(extra) should work');
  equals(callCount, 1, 'should notify observer that content has changed');
  equals(content.get('length'), 1, 'should update length of controller');
});

test("removeObject", function() {
  var callCount = 0;
  controller.addObserver('[]', function() { callCount++; });
  
  SC.run(function() { controller.removeObject(extra); });
  
  same(content, [], 'removeObject(extra) should have no effect');
  equals(callCount, 0, 'should not notify observer since content did not change');
});

test("basic array READ operations", function() {
  equals(controller.get("length"), 0, 'length should be empty');
  equals(controller.objectAt(0), undefined, "objectAt() should return undefined");
});

test("basic array WRITE operations", function() {
  var callCount = 0;
  controller.addObserver('[]', function() { callCount++; });
  
  controller.replace(0,1,[extra]);
  
  same(content, [extra], 'should modify content');
  equals(callCount, 1, 'should notify observer that content has changed');
  equals(content.get('length'), 1, 'should update length of controller');
});

test("arrangedObjects", function() {
  equals(controller.get("arrangedObjects"), controller, 'c.arrangedObjects should return receiver');
});


// ..........................................................
// NON-EMPTY ARRAY
// 

module("SC.ArrayController - array_case - NON-EMPTY", {
  setup: function() {
    content = "1 2 3 4 5".w().map(function(x) {
      return TestObject.create({ title: x });
    });
    
    controller = SC.ArrayController.create({ content: content });
    extra = TestObject.create({ title: "FOO" });
  },
  
  teardown: function() {
    controller.destroy();
  }
});

test("state properties", function() {
  equals(controller.get("hasContent"), YES, 'c.hasContent');
  equals(controller.get("canRemoveContent"), YES, "c.canRemoveContent");
  equals(controller.get("canReorderContent"), YES, "c.canReorderContent");
  equals(controller.get("canAddContent"), YES, "c.canAddContent");
});

// addObject should append to end of array + notify observers on Array itself
test("addObject", function() {
  var expected = content.slice();
  expected.push(extra);
  
  var callCount = 0;
  controller.addObserver('[]', function() { callCount++; });
  
  SC.run(function() { controller.addObject(extra); });
  
  same(content, expected, 'addObject(extra) should work');
  equals(callCount, 1, 'should notify observer that content has changed');
  equals(content.get('length'), expected.length, 'should update length of controller');
});

test("removeObject", function() {
  var expected = content.slice(), obj = expected[3];
  expected.removeObject(obj);
  
  var callCount = 0;
  controller.addObserver('[]', function() { callCount++; });
  
  SC.run(function() { controller.removeObject(obj); });
  
  same(content, expected, 'removeObject(extra) should remove object');
  equals(callCount, 1, 'should notify observer that content has changed');
  equals(content.get('length'), expected.length, 'should update length of controller');
});

test("basic array READ operations", function() {
  equals(controller.get("length"), content.length, 'length should be empty');
  
  var loc = content.length+1; // verify 1 past end as well
  while(--loc>=0) {
    equals(controller.objectAt(loc), content[loc], "objectAt(%@) should return same value at content[%@]".fmt(loc, loc));
  }
});

test("basic array WRITE operations", function() {
  var expected = content.slice();
  expected.replace(3,1,[extra]);
  
  var callCount = 0;
  controller.addObserver('[]', function() { callCount++; });
  
  controller.replace(3,1,[extra]);
  
  same(content, expected, 'should modify content');
  equals(callCount, 1, 'should notify observer that content has changed');
  equals(content.get('length'), expected.length, 'should update length of controller');
});

test("arrangedObjects", function() {
  equals(controller.get("arrangedObjects"), controller, 'c.arrangedObjects should return receiver');
});

// ..........................................................
// ADD SPECIAL CASES HERE
// 


// ..........................................................
// VERIFY SC.ARRAY COMPLIANCE
// 

SC.ArraySuite.generate("SC.ArrayController", {
  newObject: function(amt) {
    if (amt === undefined || typeof amt === SC.T_NUMBER) {
      amt = this.expected(amt);
    }
    return SC.ArrayController.create({ content: amt });
  }
});
