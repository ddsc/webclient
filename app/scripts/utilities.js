// Prevent console.log from throwing errors
if(typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}

$('input[type=checkbox]').live('click', function(e) {
  var el = $(this);
  if(el.is(':checked')) {
    el.parent().css('background', '#bae483');
    el.parent().css('border-bottom', '1px solid rgba(255, 255, 255, 0.1)');
    el.parent().css('-moz-box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
    el.parent().css('-webkit-box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
    el.parent().css('box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
    el.parent().css('-webkit-border-radius', '10px');
    el.parent().css('-moz-border-radius', '10px');
    el.parent().css('border-radius', '10px');
  } else {
    el.parent().css('background', 'none');
    el.parent().css('border-bottom', 'none');
    el.parent().css('-moz-box-shadow', 'none');
    el.parent().css('-webkit-box-shadow', 'none');
    el.parent().css('box-shadow', 'none');
    el.parent().css('-webkit-border-radius', 'none');
    el.parent().css('-moz-border-radius', 'none');
    el.parent().css('border-radius', 'none');
  }
  return true;
});


// Click handlers for toggling the filter/location/parameter UI
$('em.toggle').live("click", function(e){
  e.preventDefault();
  var el = $(this).parent().next();
  console.log(el.is(':visible'));
  // console.log(el.is(':visible'));
  if(el.is(':visible')) {
    el.addClass('hide');
  } else {
    el.removeClass('hide');
  }
});

$('em.reset').live("click", function(e){
  e.preventDefault();
  console.log("Resetting collections")
  _.each(filtercollectionview.collection.models, function(model) {
    model.set('selected', false);
  });
  _.each(locationcollectionview.collection.models, function(model) {
    model.set('selected', false);
  });
  _.each(parametercollectionview.collection.models, function(model) {
    model.set('selected', false);
  });
});

function allowDrop(e){
  e.preventDefault();
}

function drop(e){

  var data = e.dataTransfer.getData("Text");
  //e.target.appendChild(document.getElementById(data));
  console.log(e)
}


Lizard.Utils = {};
