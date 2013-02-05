// Marionette event listeners
filtercollectionview.on('collection:rendered', function(collection) {
  collection.children.each(function(view){
    // process the `view` here
    if(view.el.children[0].children[0].checked) {
      $(view.el.children[0]).css('background', '#bae483');
      $(view.el.children[0]).css('border-bottom', '1px solid rgba(255, 255, 255, 0.1)');
      $(view.el.children[0]).css('-moz-box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
      $(view.el.children[0]).css('-webkit-box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
      $(view.el.children[0]).css('box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
      $(view.el.children[0]).css('-webkit-border-radius', '10px');
      $(view.el.children[0]).css('-moz-border-radius', '10px');
      $(view.el.children[0]).css('border-radius', '10px');
    }
  });
});

locationcollectionview.on('collection:rendered', function(collection) {
  collection.children.each(function(view){
    // process the `view` here
    if(view.el.children[0].children[0].checked) {
      $(view.el.children[0]).css('background', '#bae483');
      $(view.el.children[0]).css('border-bottom', '1px solid rgba(255, 255, 255, 0.1)');
      $(view.el.children[0]).css('-moz-box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
      $(view.el.children[0]).css('-webkit-box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
      $(view.el.children[0]).css('box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
      $(view.el.children[0]).css('-webkit-border-radius', '10px');
      $(view.el.children[0]).css('-moz-border-radius', '10px');
      $(view.el.children[0]).css('border-radius', '10px');
    }
  });
});

parametercollectionview.on('collection:rendered', function(collection) {
  collection.children.each(function(view){
    // process the `view` here
    if(view.el.children[0].children[0].checked) {
      $(view.el.children[0]).css('background', '#bae483');
      $(view.el.children[0]).css('border-bottom', '1px solid rgba(255, 255, 255, 0.1)');
      $(view.el.children[0]).css('-moz-box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
      $(view.el.children[0]).css('-webkit-box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
      $(view.el.children[0]).css('box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
      $(view.el.children[0]).css('-webkit-border-radius', '10px');
      $(view.el.children[0]).css('-moz-border-radius', '10px');
      $(view.el.children[0]).css('border-radius', '10px');
    }
  });
});
