Lizard.Collections.Location = Backbone.Collection.extend({
  initialize: function() {
    // console.log('Location collection initializing');
  },
  url: settings.locations_url + '?ddsc_show_on_map=True&page_size=5000',
  model: Lizard.Models.Location
});


Lizard.Collections.LocationSearch = Backbone.Collection.extend({
  parse: function(resp, xhr) {
    // if (resp.next == null) {
    //   this.page -=1;
    // }
    return resp;
  },
  url: function () {
    return settings.locations_url + '?name__icontains=' + this.query + '&page_size=10';
  },
  query: '',
  model: Lizard.Models.Location
});
