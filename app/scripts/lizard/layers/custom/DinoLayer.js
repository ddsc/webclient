//  Class for layers for Dinoloket (www.dinoloket.nl)
//
//
Lizard.Layers.Custom.DinoLayer = Lizard.Layers.WMSLayer.extend({
  defaults: {
    display_name: '',
    visibility: false,
    opacity: 100,
    order: 0,
    //extra info and links
    description: null,
    metadata: null,
    legend_url: null,
    enable_search: true,
    //program settings
    type: 'dino', //='wms'
    subtype: null,
    addedToMap: false,
    proxyForWms: false,//todo: add support
    proxyForGetInfo: true,
    //specific settings for wms overlays
    layer_name: '',
    styles: null,
    format: 'png32',
    height: null,
    width: null,
    tiled: null,
    transparent: true,
    wms_url: ''
  },
  initialize: function () {
    this.set('type', 'dino');
    this.set('subtype', this.get('options').subtype);
    this.set('proxyForGetInfo', true);

  },
  _getNewLeafletLayer: function() {
    var extra_settings = "/export?dpi=256&_ts=1362253889361&bboxSR=3857&imageSR=3857&f=image";

    if (this.get('subtype') === 'sondering') {
      extra_settings += "&layerDefs=0:(INFORMATION_TYPE = 'DATA' OR INFORMATION_TYPE ='BOTH');1:(INFORMATION_TYPE = 'DATA' OR INFORMATION_TYPE = 'BOTH')";
    }

    return  L.tileLayer.wms(this.get('wms_url') + extra_settings, {
      zIndex: 100 - this.attributes.order,
      layers: 'test',
      format: 'png32',
      transparent: true,
      attribution: "dinodata"
    });
  },
  _getFeatureInfoRequestUrl: function(event, map) {

    var base_url = this.get('wms_url') + "/identify?";

    var bound_sw = map.getBounds().getSouthWest();
    var bound_ne = map.getBounds().getNorthEast();

    //Transform
    var source = new Proj4js.Proj('EPSG:4326');    //source coordinates will be in Longitude/Latitude
    var dest = new Proj4js.Proj('EPSG:28992');     //destination coordinates in RDS

    // transforming point coordinates
    var p = new Proj4js.Point(event.latlng.lng,event.latlng.lat,0);
    Proj4js.transform(source, dest, p);
    var bound_sw = new Proj4js.Point(bound_sw.lng, bound_sw.lat, 0);
    Proj4js.transform(source, dest, bound_sw);
    var bound_ne = new Proj4js.Point(bound_ne.lng, bound_ne.lat, 0);
    Proj4js.transform(source, dest, bound_ne);

    param = {
      geometry:'{"x":'+ p.x +',"y":'+ p.y +'}',
      layers:'top:0',
      f:'json',
      returnGeometry:true,
      mapExtent: bound_sw.x + ',' + bound_sw.y + ',' + bound_ne.x + ',' + bound_ne.y,
      geometryType:'esriGeometryPoint',
      sr: '28992',
      imageDisplay: map.getSize().x + ',' + map.getSize().y + ',256',
      tolerance:'15',
      layerDefs:'{}'
    };
    if (this.get('subtype') === 'sondering') {
      param.layerDefs = "0:(INFORMATION_TYPE = 'DATA' OR INFORMATION_TYPE ='BOTH');1:(INFORMATION_TYPE = 'DATA' OR INFORMATION_TYPE = 'BOTH')";
    }

    var url = base_url + $.param(param);
    return url;
  },
  getPopupContent: function(data) {
    var objects = $.evalJSON(data).results;

    if (objects.length > 0) {
      return this.getContent(objects[0]);
    } else {
      return false;
    }
  },
  getContent: function(object) {
    if (this.get('subtype')==='boorprofiel'){
      return "<b>" + object.value +
        "</b><br><img src='http://www.dinoloket.nl/ulkbrh-web/rest/brh/mpcolumn/"+ object.value +"?width=200&height=400' style='width:200px;height:400px'></img>";
    } else if (this.get('subtype')==='sondering') {
      return "<b>" + object.value +
        "</b><br><img src='//www.dinoloket.nl/ulkcpt-web/rest/cpt/cptchart/"+ object.value +"/4?width=300&height=300' style='width:300px;height:300px'></img>";
   } else {
      return "<b>" + object.value +
        "</b><br><img src='http://www.dinoloket.nl/ulkgws-web/rest/gws/gwstchart/"+ object.value +"001?width=300&height=300' style='width:300px;height:300px'></img>";
    }
    //http://www.dinoloket.nl/ulkbrh-web/rest/brh/mpcolumn/B38E1380?height=365&width=200
  },
  getModalPopupContent: function() {
    return 'todo'; //todo
  }
});

//add type to type index
LAYER_CLASSES['dino'] = Lizard.Layers.Custom.DinoLayer;