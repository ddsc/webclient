Lizard.Views.FavoriteView = Backbone.Marionette.ItemView.extend({
  template:function(model){
    console.log(model);
    return _.template($('#favorite-item-template').html(), {
      name: model.name,
      uuid: "fav" + model.timeserie
    }, {variable: 'favorite'});
  },
  onClose: function() {
    console.log("onClose!");
  },
  onRender: function(){
    if (!window.mapCanvas){
      this.$el.find('.goto').toggle('hidden');
    }
  },
  tagName: 'li',
  events:{
    "click .goto": 'goTo',
    "click .favstar" : 'removeFav'
  },
  removeFav: function(){
    this.model.destroy({wait:true});
  },
  goTo: function(e){
    if (window.mapCanvas){
      var location = locationCollection.get(this.model.attributes.location);
      var point = location.attributes.point_geometry;
      window.mapCanvas.panTo(new L.LatLng(point[1], point[0]));
    }
  }
});

Lizard.Views.FavoriteCollection = Marionette.CollectionView.extend({
  tagName: 'ul',
  collection: favoriteCollection,
  itemView: Lizard.Views.FavoriteView
});