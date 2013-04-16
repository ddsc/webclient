Lizard.Views.GeocoderView = Backbone.Marionette.ItemView.extend({
    //tagName: 'div',
    template: '#geocoder-template',
    events: {
        'keypress input[type=text]': 'query'
    },
    query: function(e) {
        var query = this.$el.find('.search-query').first();
        console.log(query.val());

        if(e.which === 13) {
            $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + query.val(), function(data) {
                console.log(data);
            });
        }
    }
});
