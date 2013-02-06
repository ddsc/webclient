var extra = ''; //page_size=0

var domain = (domain ? domain : 'http://test.api.dijkdata.nl/api/v0/');

var settings = {
    parameters_url: domain + 'parameters/' + extra,
    locations_url: domain + 'locations/' + extra,
    filters_url: domain +'filters' + extra ,
    timeseries_url: domain + 'timeseries/' + extra,
};