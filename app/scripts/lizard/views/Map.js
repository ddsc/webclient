// It is highly debatable if this should be a Marionette Itemview.
// The functionality now allows:
// * Location models are loaded and added to a Leaflet map.
// * The infobox is update on "hover"
// * The items and their cid's (a Backbone identifier) are added to
// a 'workspaceCollection' on click on a specific object.


Lizard.Views.Map = Backbone.Marionette.ItemView.extend({
  template: '#leaflet-template',
  workspace: null,
  mapCanvas: null,
  alarmLayer: null, // mock alarm layer
  //set on initialisation
  //modalInfo:Lizard.Utils.Map.modalInfo,
  //updateInfo: Lizard.Utils.Map.updateInfo,
  initialize: function(options) {
    console.log('LeafletView');
    // (value ? this.series.push(value) : 'nothing');
    this.lon = options.lon; //= (options.lon ? options.lon : 5.16082763671875);
    this.lat = options.lat; //= (options.lat ? options.lat : 51.95442214470791);
    this.zoom = options.zoom; //= (options.zoom ? options.zoom : 7);
    this.workspace = options.workspace;
    Lizard.App.vent.on('workspaceZoom', this.setInitialZoom, this);
    this.backgroundLayers = {
      Satellite :new L.Google("SATELLITE", {detectRetina: true}),
      Waterkaart: L.tileLayer.wms("http://test.deltaportaal.lizardsystem.nl/service/", {
        layers: 'deltaportaal',
        format: 'image/png',
        transparent: true,
        reuseTiles: true,
        attribution: "Dijkdata"
      }),
      OpenStreetMap: new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
      }),
      MapBox: new L.TileLayer('http://{s}.tiles.mapbox.com/v3/examples.map-2k9d7u0c/{z}/{x}/{y}.png', {
        attribution: 'MapBox'
      }),
      Terrain: new L.Google("TERRAIN", {detectRetina: true}),
      Hybrid :new L.Google("HYBRID", {detectRetina: true})
    };
  },
  extraLayers: {
  },
  onShow: function(){
    // Best moment to initialize Leaflet and other DOM-dependent stuff
    this.workspace = this.options.workspace;
    
    if (this.mapCanvas === null){
      this.makemapCanvas('Satellite');
    }
  },
  makemapCanvas: function (requestedBackground){
    this.mapCanvas = L.map('map', {
      layers: [this.backgroundLayers[requestedBackground]],
      center: new L.LatLng(this.lat, this.lon),
      zoom: this.zoom
    });
    var mapCanvas = this.mapCanvas;

    Lizard.App.vent.off('workspaceZoom', this.setInitialZoom, this);
    Lizard.App.vent.on('workspaceZoom', this.zoomTo, this);

    this.mapCanvas.on('click', function(e) {
        console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
    });

    var drawnItems = new L.FeatureGroup();
    this.mapCanvas.addLayer(drawnItems);

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
      edit: {
        featureGroup: drawnItems
      }
    });
    window.mc = this.mapCanvas;
    this.mapCanvas.addControl(drawControl);

    var that = this;

    this.mapCanvas.on('draw:created', function (e) {
      var type = e.layerType,
        layer = e.layer; 

      if (type === 'marker') {
        var popup = L.popup({maxWidth:525})
          .setContent(_.template($('#leaflet-annotation-template').html())());
        // Keep things below in this order.
        layer.bindPopup(popup);
        drawnItems.addLayer(layer);
        layer.openPopup();
        //datepicker
        $('.datepick-annotate').datepicker({
          format: "yyyy-mm-dd",
          onRender: function ()
           {
              var date = new Date();
              return date
           },
        }).on('changeDate', function(ev){
          $('.datepick-annotate').datepicker('hide');
        });
        $('form.annotation').submit(function() {
          var data = $(this).serializeObject();
          if (data.datetime_from){
            data.datetime_from = new Date(data.datetime_from).toISOString();
          }
          if (data.datetime_until){
            data.datetime_until = new Date(data.datetime_until).toISOString();          
          }
          data.location = layer._latlng.lat.toString() + ',' + layer._latlng.lng.toString()
          data.category = 'ddsc';
          $.post(settings.annotations_create_url, $.param(data), function(data){
            $('.top-right').notify({message:{text: 'FUCK YEAH'}})
          });
        });
        // Close and unbind the popup when clicking the "Save" button.
        // Need to use Leaflet internals because the public API doesn't offer this.
        $(popup._contentNode).find('button[type="submit"]').click(
            function() {
                popup._close();
                $('.top-right')
                .notify({
                    message: {
                        text: 'De annotatie is geplaatst.'
                    }
                })
                .show();
            }
        );
        $(popup._contentNode).find('textarea').focus();
      }
    });

    // mock alarm layer
    var alarms = [
        {
            location: [52.10311000218847, 4.8689634923324585],
            href: '#graphs/60'
        },
        {
            location: [52.10360005122914, 4.8680634923324585],
            href: '#graphs/61'
        }
    ];
    var alarmIcon = L.icon({
        iconUrl: 'scripts/vendor/images/marker-caution.png',
        iconAnchor: [16, 35],
        popupAnchor: [0, -30]
    });
    var alarmLayer = new L.FeatureGroup();
    $.each(alarms, function() {
        var alarm = this;
        var marker = L.marker(
            alarm.location,
            {
                icon: alarmIcon
            }
        );
        marker.addTo(alarmLayer);
        var popup =  new L.popup().setContent('<div><h4>Alarm: Hoge waterstand dijk</h4> '+
          '<span class="author">Vandaag</span><br>'+
          'Waterstand in de dijk is hoog. Alarm met urgentie hoog.<br>Bekijk waterdruk in dijk <a href="#graphs/60">hier<a>.</div>');
        marker.bindPopup(popup);
    });
    this.alarmLayer = alarmLayer;
    mapCanvas.addLayer(alarmLayer);

    $('.alarm-layer-toggler').click(function(e) {
        var $icon = $(this).find('i');
        if ($icon.hasClass('icon-check-empty')) {
            $icon.addClass('icon-check').removeClass('icon-check-empty');
            mapCanvas.addLayer(alarmLayer);
        }
        else {
            $icon.addClass('icon-check-empty').removeClass('icon-check');
            mapCanvas.removeLayer(alarmLayer);
        }
    });

    // end mock alarm layer

    var fullScreen = new L.Control.FullScreen();
    this.mapCanvas.addControl(fullScreen);


    L.control.scale().addTo(this.mapCanvas);
    //var legend = new Lizard.Views.MapLegend(this.workspace);
    //this.mapCanvas.addControl(legend);


    this.layerSwitcher = L.control.layers(this.backgroundLayers, this.extraLayers).addTo(this.mapCanvas);

    $('#modal').on('show', this.updateModal); //todo: ref to modal
    $('#map').css('height', $(window).height()- $('.footer').height() - $('.navbar').height() - 100);


    var mapMove = function(e) {
      var c = this.mapCanvas.getCenter();
      var z = this.mapCanvas.getZoom();
      this.mapCanvas.setView(new L.LatLng(c.lat, c.lng), z);
      var lonlatzoom = [c.lng, c.lat, z].join(',');
      Lizard.App.vent.trigger('mapPan', lonlatzoom);
    };

    this.mapCanvas.on('moveend', mapMove, this);

    this.initWorkspace();
    this._initialEvents();

    this.mapCanvas.on('click', _.bind(this.onMapClick, this));
  },
  setInitialZoom: function(lonlatzoom) {
    this.lon = lonlatzoom.split(',')[0];
    this.lat = lonlatzoom.split(',')[1];
    this.zoom = lonlatzoom.split(',')[2];
  },
  zoomTo: function(lonlatzoom){
    if (!lonlatzoom || lonlatzoom.split(',').length < 3) {
      // console.log('ja')
      lonlatzoom = '5.16082763671875,51.95442214470791,7';
    }
    this.mapCanvas.setView(new L.LatLng(
      lonlatzoom.split(',')[1],lonlatzoom.split(',')[0]),
      lonlatzoom.split(',')[2]
    );
  },
  onMapClick: function(event) {
    var coords = event.latlng;
    var that = this;
    var layers = this.workspace.where({selected:true});

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
          var popup = L.popup({maxWidth: 525}).setContent(content).setLatLng(coords);
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
