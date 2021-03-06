// ========================================================================
// SproutCore
// copyright 2006-2008 Sprout Systems, Inc.
// ========================================================================

/**
  @namespace 
  
  Implements common selection management properties for controllers.

  Selection can be managed by any controller in your applications.  This
  mixin provides some common management features you might want such as
  disabling selection, or restricting empty or multiple selections.

  To use this mixin, simply add it to any controller you want to manage 
  selection and call updateSelectionAfterContentChange()
  whenever your source content changes.  You can also override the properties
  defined below to configure how the selection management will treat your 
  content.
  
  This mixin assumes the arrangedObjects property will return the array of 
  content you want the selection to reflect.
  
  Add this mixin to any controller you want to manage selection.  It is 
  already applied to the CollectionController and ArrayController.

*/
SC.SelectionSupport = {
  
  /**
    Called just before the controller begins updating it selection.  
    
    You can use this method to make modify the selection before it is made.
    
    @param controller {SC.SelectionSupport} The controller.
    @param newSelection {Object or SC.Array} The new selection.
    @returns {Array} The modified new selection.
  */
  controllerWillBeginSelecting: function(controller, newSelection) {
    return newSelection;
  },
  
  /**
    Called just after a controller updates its selection.
    
    You can use this method to perform any changes based on the current
    selection.
    
    @param controller {SC.SelectionSupport} The controller.
    @returns {void}
  */
  controllerDidBeginSelecting: function(controller) {},
  
  /**
    Called just before a controller tries to change its selection.
    
    You can use this method to control whether the controller will actually
    change its selection.
    
    Note: If you return NO, and the current selection is invalid, the
    controller will be forced to discard the selection anyway.
    
    @param controller {SC.SelectionSupport} The controller.
    @returns {Boolean} YES to allow the controller to end selecting.
  */
  controllerShouldEndSelecting: function(controller) {
    return YES ;
  },
  
  /**
    Called just after the controller ends a selection. You can use this 
    method to work with the previous value of the selection and to perform any 
    other cleanup you need to do.
    
    @param controller {SC.SelectionSupport} The controller.
    @param previousSelection {Array} The previous selection.
    @returns {void}
  */
  controllerDidEndSelecting: function(controller, previousSelection) {},
  
  controllerDidEndSelectingObserver: function() {
    var delegate = this.get('delegate') || this ;
    
    // make sure we have an empty array as the initial previous selection
    if ( !this._previousSelection ) this._previousSelection = [];
    
    // TODO: only send notification when selection actually changes
    this.invokeDelegateMethod( delegate, 'controllerDidEndSelecting', this, this._previousSelection );
    
    this._previousSelection = this.get('selection');
  }.observes('selection'),
  
  /** 
    Call this method whenever  your source content changes to ensure the 
    selection always remains up-to-date and valid.
  */
  updateSelectionAfterContentChange: function() {
    var objects = Array.from(this.get('arrangedObjects')) ;
    var currentSelection = Array.from(this.get('selection')) ;
    var sel = [] ;
    var delegate = this.get('delegate') || this ;
    
    // the new selection is the current selection that exists in 
    // arrangedObjects or an empty selection if selection is not allowed.
    var max = currentSelection.get('length') ;
    if (this.get('allowsSelection')) {
      for(var idx=0;idx<max;idx++) {
        var obj = currentSelection.objectAt(idx) ;
        if (objects.indexOf(obj) >= 0) sel.push(obj) ;
      }
    }
    
    // if the new selection is a multiple selection, then get the first
    // object.
    var selectionLength = sel.get('length') ;
    if ((selectionLength > 1) && !this.get('allowsMultipleSelection')) {
      sel = [sel.objectAt(0)] ;
    }
    
    // if the selection is empty, select the first item.
    if ((selectionLength == 0) && !this.get('allowsEmptySelection')) {
      if (objects.get('length') > 0) sel = [objects.objectAt(0)];
    }
    
    // update the selection.
    var update = this.invokeDelegateMethod( delegate, 'controllerShouldEndSelecting', this );
    if ( update || (!update && !this.get('allowsEmptySelection')) ) {
      sel = this.invokeDelegateMethod( delegate, 'controllerWillBeginSelecting', this, sel );
      this.set('selection', sel) ;
      this.invokeDelegateMethod( delegate, 'controllerDidEndSelecting', this, currentSelection );
      this.invokeDelegateMethod( delegate, 'controllerDidBeginSelecting', this );
    }
  },
  
  /**
    @field {Array} arrangedObjects
    
    Returns the set of content objects the selection should be a part of.
    Selections in general may contain objects outside of this content, but
    this set will be used when enforcing items such as no empty selection.
    
    The default version of this property returns the receiver.
  */
  arrangedObjects: function() {
    return this;
  }.property(),
  
  /**  
    @field {Array} selection 
    
    This is the current selection.  You can make this selection and another
    controller's selection work in concert by binding them together. You
    generally have a master selection that relays changes TO all the others.
  */
  selection: function(key,value)
  {
    if (value !== undefined) {
      
      // always force to an array
      value = Array.from(value) ;
      
      var allowsSelection         = this.get('allowsSelection');
      var allowsEmptySelection    = this.get('allowsEmptySelection');
      var allowsMultipleSelection = this.get('allowsMultipleSelection');
      
      // are we even allowing selection at all?
      // if not, then bail out.
      if ( !allowsSelection ) return this._selection;
      
      // ok, new decide if the *type* of seleciton is allowed...
      switch ( value.get('length') )
      {
        case 0:
          // check to see if we're attemting to set an empty array
          // if that's not allowed, set to the first available item in 
          // arrangedObjects
          if (!allowsEmptySelection) {
            var objects = this.get('arrangedObjects') ;
            if (objects.get('length') > 0) value = [objects.objectAt(0)];
          }
          this._selection = value ;
          break;
        case 1:
          this._selection = value;
          break;
        default:
          // fall through for >= 2 items...
          // only allow if configured for multi-select
          this._selection = allowsMultipleSelection ? value : this._selection;
          break;
      }
    }
    
    return this._selection;
  }.property(),
  
  /**
    If true, selection is allowed.
    
    @type {Boolean}
  */
  allowsSelection: true,
  
  /**
    If true, multiple selection is allowed.
    
    @type {Boolean}
  */
  allowsMultipleSelection: true,
  
  /**
    If true, allow empty selection

    @type {Boolean}
  */
  allowsEmptySelection: true,
  
  /**
    YES if the receiver currently has a non-zero selection.
    
    @property
    @type {Boolean}
  */
  hasSelection: function() {
    var sel = this.get('selection') ;
    return sel && (sel.get('length') > 0) ;
  }.property('selection'),
  
  // copied from delegate_support.js
  invokeDelegateMethod: function(delegate, methodName, args) {
    args = SC.$A(arguments); args = args.slice(2, args.length) ;
    if (!delegate || !delegate[methodName]) delegate = this ;
    return delegate[methodName].apply(delegate, args) ;
  }
  
};

