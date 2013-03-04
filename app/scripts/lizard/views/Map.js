// It is highly debatable if this should be a Marionette Itemview.
// The functionality now allows:
// * Location models are loaded and added to a Leaflet map.
// * The infobox is update on "hover"
// * The items and their cid's (a Backbone identifier) are added to
// a 'workspaceCollection' on click on a specific object.
Lizard.Views.Map = Backbone.Marionette.ItemView.extend({
  template: '#leaflet-template',
  workspace: null, //set on initialisation
  mapCanvas: null,
  //modalInfo:Lizard.Utils.Map.modalInfo,
  //updateInfo: Lizard.Utils.Map.updateInfo,
  initialize: function(options) {
    console.log('LeafletView');
    // (value ? this.series.push(value) : 'nothing');
    options.lon; //= (options.lon ? options.lon : 5.16082763671875);
    options.lat; //= (options.lat ? options.lat : 51.95442214470791);
    options.zoom; //= (options.zoom ? options.zoom : 7);
    this.workspace = options.workspace;
  },
  //background layer
  backgroundLayers: {
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
    Satellite :new L.Google("SATELLITE", {detectRetina: true}),
    Hybrid :new L.Google("HYBRID", {detectRetina: true})
  },
  extraLayers: {
  grondwater:  L.tileLayer.wms("http://www.dinoloket.nl/arcgis/rest/services/dinoloket/gw_gwst_rd_dynamic/MapServer/export?dpi=256&_ts=1362253889361&bboxSR=3857&imageSR=3857&f=image", {
    layers: 'test',
    format: 'png32',
    transparent: true,
    attribution: "Dijkdata"
  })
  },
  onShow: function(){
    // Best moment to initialize Leaflet and other DOM-dependent stuff
    this.workspace = this.options.workspace;

    this.mapCanvas = L.map('map', {
      layers: [this.backgroundLayers.Waterkaart],
      center: new L.LatLng(this.options.lat, this.options.lon),
      zoom: this.options.zoom
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
          title: 'Annoteren op de kaart'
        }
      },
      edit: {
        featureGroup: drawnItems
      }
    });
    this.mapCanvas.addControl(drawControl);

    this.mapCanvas.on('draw:created', function (e) {
      var type = e.layerType,
        layer = e.layer;

      if (type === 'marker') {
        var popup = L.popup()
          .setContent('<div style="height:200px;">'+$('#leaflet-annotation-template').html()+'</div>');
        layer.bindPopup(popup);
      }

      drawnItems.addLayer(layer);
    });

    var fullScreen = new L.Control.FullScreen();
    this.mapCanvas.addControl(fullScreen);


    L.control.scale().addTo(this.mapCanvas);
    this.layerSwitcher = L.control.layers(this.backgroundLayers, this.extraLayers).addTo(this.mapCanvas);

    $('#modal').on('show', this.updateModal); //todo: ref to modal
    $('#map').css('height', $(window).height()- $('.footer').height() - $('.navbar').height() - 100);

    var that = this;

    function fixzoom(e) {
      that.mapCanvas.zoomOut(false);
      that.mapCanvas.off('viewreset', fixzoom);
    }
    that.mapCanvas.zoomIn(); // <-- TODO: Plz fix this hack which triggers a redraw of Leaflet. A gray screen will show if omitted.
    that.mapCanvas.on('viewreset', fixzoom);

    // window.mapCanvas.invalidateSize()

    var mapMove = function(e) {
      var c = that.mapCanvas.getCenter();
      var z = that.mapCanvas.getZoom();
      that.mapCanvas.setView(new L.LatLng(c.lat, c.lng), z);
      Backbone.history.navigate('map/' + [c.lng, c.lat, z].join(','));
    };

    that.mapCanvas.on('moveend', mapMove);

    this.initWorkspace();
    this._initialEvents();

    this.mapCanvas.on('click', this.onMapClick)

  },
  onMapClick: function(event) {
    var coords = event.latlng;

    geometry = event.latlng;
    imageDisplay = this.getSize(); //x, y

    var base_url = 'http://www.dinoloket.nl/arcgis/rest/services/dinoloket/gw_gwst_rd_dynamic/MapServer/identify?'
    // geometry=&layers=top%3A0&f=json&returnGeometry=true&
    // mapExtent=118894%2C466402%2E4%2C143086%2C480917%2E6&geometryType=esriGeometryPoint&sr=28992&imageDisplay=900%2C540%2C96&tolerance=3&layerDefs=%7B%7D

    var source = new Proj4js.Proj('EPSG:4326');    //source coordinates will be in Longitude/Latitude
    var dest = new Proj4js.Proj('EPSG:28992');     //destination coordinates in LCC, south of France

    // transforming point coordinates
    var p = new Proj4js.Point(event.latlng.lng,event.latlng.lat,0);   //any object will do as long as it has 'x' and 'y' properties
    var p_rds = Proj4js.transform(source, dest, p);      //do the transformation.  x and y are modified in place

    param = {
      geometry:'{"x":'+ p_rds.x +',"y":'+ p_rds.y +'}',
      layers:'top:0',
      f:'json',
      returnGeometry:true,
      mapExtent: '118894,466402.4,143086,480917.6',//this.getBounds().toBBoxString(),
      geometryType:'esriGeometryPoint',
      sr: '28992',
      imageDisplay: this.getSize().x + ',' + this.getSize().y + ',256',
      tolerance:'15',
      layerDefs:'{}'
    }

    var url = base_url + $.param(param)

    $.ajax({
      url: 'http://test.api.dijkdata.nl/api/v0/proxy/?' + $.param({url: url}),
      dataType: "html",
      type: "GET",
      //async: false,
      success: function(data) {
        debugger;
        if (data.indexOf("<table") != -1) {
          popup.setContent(data);
          popup.setLatLng(e.latlng);
          map.openPopup(popup);

          // dork with the default return table - get rid of geoserver fid column, apply bootstrap table styling
          /*if ($(".featureInfo th:nth-child(1)").text() == "fid") $('.featureInfo td:nth-child(1), .featureInfo th:nth-child(1)').hide();
           $("caption.featureInfo").removeClass("featureInfo");
           $("table.featureInfo").addClass("table").addClass("table-striped").addClass("table-condensed").addClass("table-hover").removeClass("featureInfo");*/
        }
      }
    });

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
      this.listenTo(this.workspace, "change:order", this.changeOrderOfLayer, this);
    }
  },
  //add layer from workspace to Map (if visible)
  addLayer: function(layerModel){
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
//  //reorder layers
//  sortWorkspace: function() {
//    console.log('sortWorkspace - now  happens in Lizard.Views.ActiveWorkspace drop');
//    var that = this;
//    this.workspace.each( function(workspaceItem) {
//      debugger;
//      var layer = workspaceItem.get('layer');
//      var index = that.workspace.indexOf(workspaceItem);
//      layer.getLeafletLayer().setZIndex(50 - 2 * index);
//    });
//  },
  changeOrderOfLayer: function(layerModel) {
    var layer = layerModel.get('layer').getLeafletLayer().setZIndex(100 - 2 * layerModel.get('order'));
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
