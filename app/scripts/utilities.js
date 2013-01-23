// Prevent console.log from throwing errors
if(typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}


// Click handlers for toggling the filter/location/parameter UI
$('li#filters a em').live("click", function(e){
  e.preventDefault();
  var el = $(this).parent().next();
  if(el.is(':visible')) {
    el.addClass('hide');
  } else {
    el.removeClass('hide');
  }
});
$('li#locations a em').live("click", function(e){
  e.preventDefault();
  var el = $(this).parent().next();
  if(el.is(':visible')) {
    el.addClass('hide');
  } else {
    el.removeClass('hide');
  }
});
$('li#parameters a em').live("click", function(e){
  e.preventDefault();
  var el = $(this).parent().next();
  if(el.is(':visible')) {
    el.addClass('hide');
  } else {
    el.removeClass('hide');
  }
});