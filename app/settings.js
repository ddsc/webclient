var extra = ''; //page_size=0

var domain = (domain ? domain : 'http://test.api.dijkdata.nl/api/v0/');

var settings = {
    parameters_url: domain + 'parameters/' + extra,
    locations_url: domain + 'locations/' + extra,
    filters_url: domain +'logicalgroups/' + extra ,
    timeseries_url: domain + 'timeseries/' + extra,
    collages_url: domain + 'collages/',
	layers_url: 'http://test.api.dijkdata.nl/api/v0/' + 'layers/',
	account_url: domain + 'account/',
	login_token_url: domain + 'account/login-url/',
	logout_token_url: domain + 'account/logout-url/'
};

/**
 * Configure jQuery to send cookies with XmlHttpRequests. Necessary to access
 * the DDSC API.
 *
 * For this to work, the API server must explicitly respond with:
 * Access-Control-Allow-Credentials: true
 * Access-Control-Allow-Origin: http://production-server
 * Access-Control-Allow-Origin: http://staging-server
 * Access-Control-Allow-Origin: http://127.0.0.1
 * et cetera
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
