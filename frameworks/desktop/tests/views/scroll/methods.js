// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            portions copyright @2009 Apple, Inc.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/*global module test htmlbody ok equals same stop start */

var pane, view ;
var appleURL='http://weblogs.baltimoresun.com/business/consuminginterests/blog/apple-logo1.jpg';
module("SC.ScrollView",{
	setup: function() {
	  SC.RunLoop.begin();
	    pane = SC.MainPane.create({
		  childViews: [
		   SC.ScrollView.extend({
		     contentView: SC.ImageView.design({value: appleURL, layout: {height:400, width:400}})
		   }),
		   SC.ScrollView.extend({
		     contentView: SC.ImageView.design({value: appleURL, layout: {height:2000, width:2000}})
		   })
		   
		   ],
		   
		  expectedVertLine: function(line) {
			var ret = view.get('verticalLineScroll')*line;
			var alt = view.get('maximumVerticalScrollOffset');
			ret = (ret > alt)? alt : ret;
		    return ret;
		  },
		  expectedHorzLine: function(line) {
			var ret = view.get('horizontalLineScroll')*line;
			var alt = view.get('maximumHorizontalScrollOffset');
			ret = (ret > alt)? alt : ret;
		    return ret;
		  },
		  expectedVertPage: function(page) {
			var ret = view.get('verticalPageScroll')*line;
			var alt = view.get('maximumVerticalScrollOffset');
			ret = (ret > alt)? alt : ret;
		    return ret;
		  },
		  expectedHorzPage: function(page) {
			var ret = view.get('horizontalPageScroll')*line;
			var alt = view.get('maximumHorizontalScrollOffset');
			ret = (ret > alt)? alt : ret;
		    return ret;
		  }
		});
		
		
		pane.append(); // make sure there is a layer...
	  SC.RunLoop.end();	
	  view = pane.childViews[0];
	  view.get('containerView').get('frame').height = 100;
	  view.get('containerView').get('frame').width = 100;

	  view2 = pane.childViews[1];
	  view2.get('containerView').get('frame').height = 100;
	  view2.get('containerView').get('frame').width = 100;
	  
	},
	
	teardown: function() {
    	pane.remove();
    	pane = view = null ;
  	}
});



test("Scrolling to a certain co-ordinate of the container view", function() {
	equals(view.get('horizontalScrollOffset'), 0, "Initial horizontal offset must be zero");
	equals(view.get('verticalScrollOffset'), 0, "Initial vertical offset must be zero");
	view.scrollTo(100, 100);
	equals(view.get('horizontalScrollOffset'), 100, "After scrolling to 100, horizontal offset must be");
	equals(view.get('verticalScrollOffset'), 100, "After scrolling to 100, vertical offset must be");
	view.scrollTo(400, 400);
	equals(view.get('horizontalScrollOffset'), view.get('maximumHorizontalScrollOffset'), "After scrolling to 400, horizontal offset must be maximum");
	equals(view.get('verticalScrollOffset'), view.get('maximumVerticalScrollOffset'), "After scrolling to 400, vertical offset must be maximum");
});

test("Scrolling relative to the current possition of the container view", function() {
	equals(view.get('horizontalScrollOffset'), 0, "Initial horizontal offset must be zero");
	equals(view.get('verticalScrollOffset'), 0, "Initial vertical offset must be zero");
	view.scrollBy(100, 100);
	equals(view.get('horizontalScrollOffset'), 100, "After scrolling by 100, horizontal offset must be");
	equals(view.get('verticalScrollOffset'), 100, "After scrolling by 100, vertical offset must be");
	view.scrollBy(100, 100);
	equals(view.get('horizontalScrollOffset'), 200, "After scrolling by 100, horizontal offset must be");
	equals(view.get('verticalScrollOffset'), 200, "After scrolling by 100, vertical offset must be");
	view.scrollBy(400, 400);
	equals(view.get('horizontalScrollOffset'), view.get('maximumHorizontalScrollOffset'), "After scrolling by 400, horizontal offset must be maximum");
	equals(view.get('verticalScrollOffset'), view.get('maximumVerticalScrollOffset'), "After scrolling by 400, vertical offset must be maximum");
});

test("Scrolling through line by line", function() {
	var line = 3;
	equals(view.get('horizontalScrollOffset'), 0, "Initial horizontal offset must be zero");
	equals(view.get('verticalScrollOffset'), 0, "Initial vertical offset must be zero");
	view.scrollDownLine(line);
	equals(view.get('horizontalScrollOffset'), 0, "After scrolling down by lines, horizontal offset is unchanged");
	equals(view.get('verticalScrollOffset'), pane.expectedVertLine(line), "After scrolling down by lines, vertical offset must be");
	view.scrollUpLine(line);
});

test("maximumHorizontalScrollOffset() returns the maximum horizontal scroll dimention", function() {
  var old_horizontalScrollOffset=2;
  var old_verticalScrollOffset=2;

  view2.set('horizontalScrollOffset',old_horizontalScrollOffset);
  view2.set('verticalScrollOffset',old_verticalScrollOffset);
  view2.scrollRightPage(3);
  equals(view2.get('horizontalScrollOffset'),1900, 'maximum y coordinate should be 1900');	
 
  view2.set('horizontalScrollOffset',old_horizontalScrollOffset);
  view2.set('verticalScrollOffset',old_verticalScrollOffset);
  view2.scrollLeftPage(3);
  equals(view2.get('horizontalScrollOffset'),0, 'minimum y coordinate should be 0');	
  	
});


test("maximumVerticalScrollOffset() returns the maximum vertical scroll dimention", function() {
  var old_horizontalScrollOffset=2;
  var old_verticalScrollOffset=2;

  view2.set('horizontalScrollOffset',old_horizontalScrollOffset);
  view2.set('verticalScrollOffset',old_verticalScrollOffset);
  view2.scrollDownPage(3);
  equals(view2.get('verticalScrollOffset'),1900, 'maximum coordinate should be 1900'); 

  view2.set('horizontalScrollOffset',old_horizontalScrollOffset);
  view2.set('verticalScrollOffset',old_verticalScrollOffset);
  view2.scrollUpPage(3);
  equals(view2.get('verticalScrollOffset'),0, 'The minimum y coordinate should be 0');
 
});