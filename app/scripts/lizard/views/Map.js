// It is highly debatable if this should be a Marionette Itemview.
// The functionality now allows:
// * Location models are loaded and added to a Leaflet map.
// * The infobox is update on "hover"
// * The items and their cid's (a Backbone identifier) are added to
// a 'workspaceCollection' on click on a specific object.

Lizard.Views.MapSearchResult = Backbone.Marionette.ItemView.extend({
  tagName: 'li class="search-results"',
  template: '#location-results-template',
  events: {
    'click .location-result': 'zoomTo'
  },
  zoomTo: function () {
    var point = this.model.get('point_geometry');
    var leafPoint = new L.LatLng(point[1], point[0]);
    mc.setView(leafPoint, 13);
    this.model.collection.reset();
  }
});

Lizard.Views.MapSearch = Backbone.Marionette.CompositeView.extend({
  // id: 'location-search',
  itemViewContainer: '#location-search-collection',
  template: '#location-search-collection-template',
  events: {
      'keypress #search-location': 'search'
  },
  search: function(e) {
      var self = this;

      if (this.searchTimeout !== null) {
          window.clearTimeout(this.searchTimeout);
          this.searchTimeout = null;
      }

      this.searchTimeout = window.setTimeout(function () {
          self.collection.reset();
          // self.collection.page = 1;
          self.collection.isLoading = true;
          self.collection.query = $('#search-location').val();
          self.collection.fetch()
          .always(function () {
              self.collection.isLoading = false;
          });
      }, 700);
  },
  itemView: Lizard.Views.MapSearchResult
});

Lizard.Views.Map = Backbone.Marionette.ItemView.extend({
  template: '#leaflet-template',
  workspace: null,
  mapCanvas: null,
  alarmLayer: null, // mock alarm layer
  //set on initialisation
  //modalInfo:Lizard.Utils.Map.modalInfo,
  //updateInfo: Lizard.Utils.Map.updateInfo,
  initialize: function(options) {
    // console.log('LeafletView');
    // (value ? this.series.push(value) : 'nothing');
    this.lon = (options.lon ? options.lon : 5.16082763671875);
    this.lat = (options.lat ? options.lat : 51.95442214470791);
    this.zoom = (options.zoom ? options.zoom : 7);
    this.workspace = options.workspace;
    this.container = (options.container ? options.container : 'map');
    this.backgroundLayers = {
      // Satellite :new L.Google("SATELLITE", {detectRetina: true}),
      Waterkaart: L.tileLayer.wms("http://test.deltaportaal.lizardsystem.nl/service/", {
        layers: 'deltaportaal',
        format: 'image/png',
        transparent: true,
        reuseTiles: true,
        attribution: "Dijkdata",
        maxZoom: 30
      }),
      OpenStreetMap: new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
      })
      // MapBox: new L.TileLayer('http://{s}.tiles.mapbox.com/v3/examples.map-2k9d7u0c/{z}/{x}/{y}.png', {
      //   attribution: 'MapBox'
      // })
      // Terrain: new L.Google("TERRAIN", {detectRetina: true}),
      // Hybrid :new L.Google("HYBRID", {detectRetina: true})
    };
  },
  extraLayers: {
  },
  onShow: function(){
    // Best moment to initialize Leaflet and other DOM-dependent stuff
    this.workspace = this.options.workspace;

    if (this.mapCanvas === null){
      this.makemapCanvas('OpenStreetMap');
    }
  },
  makemapCanvas: function (requestedBackground){
    this.mapCanvas = new L.Map(this.container, {
      layers: [this.backgroundLayers[requestedBackground]],
      center: new L.LatLng(this.lat, this.lon),
      zoom: this.zoom
    });
    var mapCanvas = this.mapCanvas;
    Lizard.App.vent.on('workspaceZoom', this.workspaceZoom, this);

    this.mapCanvas.on('click', function(e) {
        console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
    });

    var drawnItems = new L.FeatureGroup();
    this.mapCanvas.addLayer(drawnItems);


    var geolocateControl = L.Control.extend({
        options: {
            position: 'topleft'
        },

        onAdd: function (map) {

          var className = 'leaflet-control-zoom leaflet-bar leaflet-bar-geolocate',
              container = L.DomUtil.create('div', className);

          this._map = map;

          this._zoomInButton = this._createButton(
                  '<i class="icon-screenshot"></i>', 'Zoek mijn lokatie',  className + '-geo',  container, this._locateMe,  this);

          return container;

        },
        _locateMe: function (e) {
          this._map.locate({
            setView: true,
            enableHighAccuracy: true
          });
        },
        _createButton: function (html, title, className, container, fn, context) {
          var link = L.DomUtil.create('a', className, container);
          link.innerHTML = html;
          link.href = '#';
          link.title = title;

          var stop = L.DomEvent.stopPropagation;

          L.DomEvent
              .on(link, 'click', stop)
              .on(link, 'mousedown', stop)
              .on(link, 'dblclick', stop)
              .on(link, 'click', L.DomEvent.preventDefault)
              .on(link, 'click', fn, context);

          return link;
        }
    });

    // panner:
    window.LeafletPanControl = L.Control.extend({
        options: {
            position: 'topleft'
        },

        onAdd: function (map) {

          var className = 'leaflet-control-zoom leaflet-bar leaflet-bar-panner',
              container = L.DomUtil.create('div', className);

          this._map = map;

          this._upButton = this._createButton(
                  '<i class="icon-arrow-up"></i>', 'Omhoog',  className + '-up',  container, this._panUp,  this);
          this._leftButton = this._createButton(
                  '<i class="icon-arrow-left"></i>', 'Links',  className + '-left',  container, this._panLeft,  this);
          this._rightButton = this._createButton(
                  '<i class="icon-arrow-right"></i>', 'Rechts',  className + '-right',  container, this._panRight,  this);
          this._downButton = this._createButton(
                  '<i class="icon-arrow-down"></i>', 'Naar beneden',  className + '-down',  container, this._panDown,  this);

          return container;

        },
        _panLeft: function () {
          var moveBy = [-100,0];
          this._map.panBy(moveBy);
        },
        _panRight: function () {
          var moveBy = [100,0];
          this._map.panBy(moveBy);
        },
        _panDown: function () {
          var moveBy = [0, 100];
          this._map.panBy(moveBy);
        },
        _panUp: function () {
          var moveBy = [0, -100];
          this._map.panBy(moveBy);
        },
        _createButton: function (html, title, className, container, fn, context) {
          var link = L.DomUtil.create('a', className, container);
          link.innerHTML = html;
          // link.href = '#';
          link.title = title;

          var stop = L.DomEvent.stopPropagation;

          L.DomEvent
              .on(link, 'click', stop)
              .on(link, 'mousedown', stop)
              .on(link, 'dblclick', stop)
              .on(link, 'click', L.DomEvent.preventDefault)
              .on(link, 'click', fn, context);

          return link;
        }
    });

    var drawControl = new L.Control.Draw({
      draw: {
        position: 'topleft',
        polygon: false,
        circle: false,
        rectangle: false,
        polyline: false,
        marker: {
          title: 'Annotatie plaatsen'
        }
      },
      edit: false // This disables the edit toolbar which we don't use at the moment
    });
    window.mc = this.mapCanvas;
    window.drawnItems = drawnItems;

    this.mapCanvas.addControl(drawControl);
    this.mapCanvas.addControl(new geolocateControl());

    window.mc.on('draw:created', function (e) {
      var type = e.layerType,
        layer = e.layer;

      if (type === 'marker') {
        window.drawnItems.addLayer(layer);
        Lizard.App.vent.trigger('makeAnnotation', layer);
      }
    });

    // end mock alarm layer

    // new L.Control.GeoSearch({
    //     provider: new L.GeoSearch.Provider.Google()
    // }).addTo(mapCanvas);

    // revised full screen also works on IE9.  
    var fullScreen = new L.Control.FullScreen();
    this.mapCanvas.addControl(fullScreen);

    if (account.get('panner') == true) {
      this.mapCanvas.addControl(new window.LeafletPanControl());
    } else {
      account.on('change:panner', function () {
        if (account.get('panner') == true) {
          this.mapCanvas.addControl(new window.LeafletPanControl());
        }      
      }, this);        
    }


    L.control.scale().addTo(this.mapCanvas);
    //var legend = new Lizard.Views.MapLegend(this.workspace);
    //this.mapCanvas.addControl(legend);


    this.layerSwitcher = L.control.layers(this.backgroundLayers, this.extraLayers).addTo(this.mapCanvas);

    $('#modal').on('show', this.updateModal); //todo: ref to modal
    $('#map').css('height', $(window).height()- $('.footer').height() - $('.navbar').height() - 100);
    this.mapCanvas.invalidateSize();
    this.mapCanvas.on('moveend', this.mapMove, this);

    this.initWorkspace();
    this._initialEvents();

    this.clickcount = 0;
    var that = this;
    this.mapCanvas.on('click', this.checkSingleClick, that);
    this.mapCanvas.on('dblclick', this.cancelSingleClick, that);
  },
  setInitialZoom: function(lonlatzoom) {
    this.lon = lonlatzoom.split(',')[0];
    this.lat = lonlatzoom.split(',')[1];
    this.zoom = lonlatzoom.split(',')[2];
  },
  mapMove: function (e) {
      var c = this.mapCanvas.getCenter();
      var z = this.mapCanvas.getZoom();
      var lonlatzoom = [c.lng, c.lat, z].join(',');

      Backbone.history.navigate('map/' + lonlatzoom);
  },
  workspaceZoom: function(lonlatzoom){
    // disable moveend event
    this.mapCanvas.off('moveend', this.mapMove, this);
    this.zoomTo(lonlatzoom);
    this.mapCanvas.on('moveend', this.mapMove, this);
  },
  zoomTo: function(lonlatzoom){
    if (!lonlatzoom || lonlatzoom.split(',').length < 3) {
      lonlatzoom = '5.16082763671875,51.95442214470791,7';
    }
    this.mapCanvas.setView(new L.LatLng(
      lonlatzoom.split(',')[1],lonlatzoom.split(',')[0]),
      lonlatzoom.split(',')[2],
      { animate: false }
    );
  },
  clickTimer: null,
  cancelSingleClick: function(event){
    if (this.clickTimer != null) {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
    }
  },
  checkSingleClick: function(event){
      var that = this;
      if (this.clickTimer == null) {
      this.clickTimer = setTimeout(function(){
        //if (that.clickcount = 1){
          that.onMapClick(event);
          that.clickTimer = null;
        //}
        //that.clickcount = 0;
      }, 350);
    }
    return;
  },
  onMapClick: function(event) {
    var coords = event.latlng;
    var that = this;
    var layers = this.workspace.where({selected:true});
    this.clickcount = 0;

    if (layers.length < 1) {
      // alert('selecteer eerst een kaartlaag');
      $('.top-right').notify({
        message: {
          text: 'Selecteer eerst een kaartlaag s.v.p.'
        }}).show();
      return true;
    } else {
      var layer = layers[0].get('layer');
      layer.getFeatureInfo(event, this.mapCanvas, {}, function(data) {
        var content = layer.getPopupContent(data);
        if (content) {
          //Rrose is not always positioned correctly.
          //The default popup works and suffices?
          //var popup = new L.Rrose({
          var popup = new L.popup({
            autoPan: true,
            minWidth: 300,
          }).setContent(content).setLatLng(coords);
          that.mapCanvas.openPopup(popup);
        }
      });
    }

  },
  initWorkspace: function() {
    var that = this;
    this.workspace.each(function(model) {
      that.addLayer(model);
    });
  },
  _initialEvents: function(){
    if (this.workspace){
      this.listenTo(this.workspace, "add", this.addLayer, this);
      this.listenTo(this.workspace, "remove", this.removeLayer, this);
      this.listenTo(this.workspace, "reset", this.resetWorkspace, this);
      this.listenTo(this.workspace, "change:visibility", this.changeVisibilityLayer, this);
      this.listenTo(this.workspace, "change:opacity", this.changeOpacityLayer, this);
      this.listenTo(this.workspace, "change:order", this.changeOrderOfLayer, this);
    }
  },
  //add layer from workspace to Map (if visible)
  addLayer: function(layerModel){
    // Set opacity 'on add' (either as specified API-side or modified locally)
    layerModel.get('layer').getLeafletLayer().setOpacity(layerModel.get('opacity')/100);
    if (layerModel.get('visibility')) {
      this.mapCanvas.addLayer(layerModel.get('layer').getLeafletLayer());
      layerModel.set('addedToMap', true);
    }
  },
  //remove layer from Map
  removeLayer: function(layerModel) {
    this.mapCanvas.removeLayer(layerModel.get('layer').getLeafletLayer());
    layerModel.set('addedToMap', false);
  },
  //remove all layers of workspace from map
  resetWorkspace: function(newModels, oldRef) {
    console.log('resetWorkspace');
    var that = this;
    oldRef.previousModels.forEach(function(layerModel){
      if (layerModel.get('addedToMap')) {
        that.removeLayer(layerModel);
      }
    });
    this.workspace.each(function(layerModel){
      that.addLayer(layerModel);
    });
  },
  changeOpacityLayer: function(layerModel) {
    var layer = layerModel.get('layer').getLeafletLayer().setOpacity(layerModel.get('opacity')/100);
    return layer;
  },
  changeOrderOfLayer: function(layerModel) {
    var layer = layerModel.get('layer').getLeafletLayer().setZIndex(100 - layerModel.get('order'));
  },
  //set layer visibility
  changeVisibilityLayer: function(layerModel) {
    if (layerModel.get('visibility')) {
      this.addLayer(layerModel);
    } else {
      this.removeLayer(layerModel);
    }
  }
});

Lizard.Views.AlarmItem = Backbone.Marionette.ItemView.extend({
    related_object: null,
    tagName: 'li',
    className: 'alarm-open',
    events:{
        'click': 'zoomTo'
    },
    collectionEvents: {
        'change reset remove add' : 'render'
    },
    zoomTo: function (){
      related_type = this.model.get('related_type');
      if (related_type == 'location') {
        var related_uuid = this.model.get('related_uuid');
        this.getLocationPopup(related_uuid);
      } else if (related_type == 'timeseries') {
        var ts_uuid = this.model.get('related_uuid');
        var newTs = new Lizard.Models.Timeserie({
          url: settings.timeseries_url.split('?')[0] + ts_uuid
        });
        var that = this;
        newTs.fetch().done(function (model) {
          var related_uuid = model.get('location').uuid;
          // that.model.set('related_type', 'location');
          // that.model.set('related_uuid', related_uuid);
          that.getLocationPopup(related_uuid);
        });
      } else {
        var that = this;
        var location = that.model.get('location');
        if (location) {
          that.getLocationPopup(location['uuid']);
        } else {
          $('.top-right').notify({
            type:'warning', message: {
              text: 'Er lijkt geen Locatie gekoppeld te zijn'}
            }).show()
        }
      }
    },
    getLocationPopup: function (related_uuid) {
        var related_location = locationCollection.get(related_uuid);
        if (related_location === undefined) { return ;}
        var point_geom = related_location.get('point_geometry');
        var point = new L.LatLng(point_geom[1], point_geom[0]);
        var marker = Lizard.Map.ddsc_layers.markers.getLayer(related_location.get('leaflet_id'));
        var visPar = Lizard.Map.ddsc_layers.markers.getVisibleParent(marker);
        if (Lizard.Map.ddsc_layers.get('addedToMap') ===  false) {return;}
        if (Object.getPrototypeOf(visPar).hasOwnProperty('spiderfy')) {
          visPar.spiderfy();
        }
        marker._map = mc;
        marker.fireEvent('click', {
          latlng: point,
          layerPoint: mc.latLngToLayerPoint(point),
          containerPoint: mc.latLngToContainerPoint(point)
        });
    },
    template: function (model){
        return _.template(
            $('#alarm-item-template').html(), 
            model, 
            {variable: 'alarm'});
    },
    onRender: function () {
      this.$el.find('span.alarm-popover').popover({trigger: 'hover'});
    }
});

Lizard.Views.AlarmView = Backbone.Marionette.CollectionView.extend({
    collection: null,
    tagName: 'ul',
    className: 'add-map-item ',
    initialize: function (options){
        this.collection = options.collection;
    },
    itemView: Lizard.Views.AlarmItem
});

Lizard.Views.StatusItem = Lizard.Views.AlarmItem.extend({
  className: 'alarm-open',
  template: function (model){
      return _.template(
          $('#status-item-template').html(), 
          model, 
          {variable: 'status'});
  },
});

Lizard.Views.StatusView = Lizard.Views.AlarmView.extend({
  itemView: Lizard.Views.StatusItem
});
