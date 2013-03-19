var extra = '?page_size=300'; //
// var extra = '?page_size=1000';


var domain = (domain ? domain : 'http://api.dijkdata.nl/api/v0/');
var test_domain = (test_domain ? test_domain : 'http://test.api.dijkdata.nl/api/v0/');


var settings = {
    parameters_url: domain + 'parameters/' + extra,
    locations_url: domain + 'locations/?logicalgroup=6&has_geometry=true&page_size=300',
    wms_proxy_base_url: test_domain + 'proxy/?',
    filters_url: domain +'logicalgroups/' + extra,
    timeseries_url: domain + 'timeseries/?logicalgroup=6&page_size=300',
    collages_url: test_domain + 'collages/',
    workspace_url: test_domain + 'workspaces/',
	layers_url: test_domain + 'layers/?page_size=100',
	account_url: test_domain + 'account/',
	login_token_url: test_domain + 'account/login-url/',
	logout_token_url: test_domain + 'account/logout-url/'
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
    timeout: 60 * 1000,
    // crossDomain:
    // The docs say: default: false for same-domain requests, true for cross-domain requests.
    // So the default is good enough for us.
    //crossDomain: true,
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
