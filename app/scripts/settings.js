var extra = '?page_size=10'; //
// var extra = '?page_size=1000';

var lizardDomain = 'https://ddsc.lizard.net/';
var api = lizardDomain + 'api/v2/';
var test_api = (test_api ? test_api : 'http://test.api.ddsc.nl/api/v1/');

var settings = {
    parameters_url: api + 'parameters/' + extra,
    locations_url: api + 'locations/',
    wms_proxy_base_url: lizardDomain + 'proxy/?',
    filters_url: api +'logicalgroups/' + extra,
    timeseries_url: api + 'timeseries/',
    rasters_url: api + 'rasters/',
    alarms_url: api + 'alarms/',
    status_url: api + 'timeseries/late/?page_size=100',
    collages_url: api + 'collages/?page_size=100&ordering=name',
    workspace_url: api + 'workspaces/?page_size=100',
    layers_url: api + 'layers/',
    account_url: api + 'account/',
    annotations_url: api + 'annotations/',
    collages_create_url: api + 'collages/',
    collageitems_create_url: api + 'collageitems/',
    management_ui_url: lizardDomain + 'management/ddsc',
    api_version: 'v2',
    webclient_version: '1.0.0'
};

/**
 * Configure jQuery to send cookies with XmlHttpRequests. Necessary to access
 * the DDSC API.
 *
 * For this to work, the API server must explicitly respond with:
 * Access-Control-Allow-Credentials: true
 * Access-Control-Allow-Origin: [origin_sent_in_request]
 *
 * Note: this must be executed before any Ajax calls!
 */
$.ajaxSetup({
    // Be friends with django, add csrf token. cp-ed from
    // http://stackoverflow.com/questions/5100539/django-csrf-check-failing-with-an-ajax-post-request
    beforeSend: function(xhr, settings) {
      function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
          var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
              var cookie = jQuery.trim(cookies[i]);
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
            }
          }
        }
        return cookieValue;
      }
      if (!(/^http:.*/.test(api) || /^https:.*/.test(api))) {
        // Only send the token to relative URLs i.e. locally.
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        }
     },
    timeout: 60 * 1000,
    // The docs say: default: false for same-domain requests, true for
    // cross-domain requests. So the default is good enough for us.
    // crossDomain: true,
    xhrFields: {
        // withCredentials:
        // The docs say withCredentials has no effect when same origin is used:
        // https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html#dom-xmlhttprequest-withcredentials
        // "True when user credentials are to be included in a cross-origin request.
        // False when they are to be excluded in a cross-origin request
        // and when cookies are to be ignored in its response. Initially false."
        // So, explicitly set this to true for our purposes.
        withCredentials: true
    }
});
