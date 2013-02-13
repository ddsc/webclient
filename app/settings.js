var extra = ''; //page_size=0

var domain = (domain ? domain : 'http://api.dijkdata.nl/api/v0/');

var settings = {
    parameters_url: domain + 'parameters/' + extra,
    locations_url: domain + 'locations/' + extra,
    filters_url: domain +'logicalgroups/' + extra ,
    timeseries_url: domain + 'timeseries/' + extra,
    collages_url: domain + 'collages/',
	layers_url: domain + 'layers/'
};
