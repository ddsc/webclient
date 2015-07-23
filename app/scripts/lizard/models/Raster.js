Lizard.Models.Raster = Lizard.Models.Timeserie.extend({
	initialize: function (raster) {
		this.attributes.name = raster.store_path;
		this.attributes.value_type = 'georeferenced remote sensing';
		this.attributes.parameter_referenced_unit = {};
		this.attributes.events = raster.url;
	}
});