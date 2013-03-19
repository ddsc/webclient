Lizard.Views.MapLegend = L.Control.extend({
  options: {
    collapsed: true,
    position: 'bottomleft',
    autoZIndex: true
  },

  initialize: function (workspace, options) {
    L.setOptions(this, options);

    this._lastZIndex = 0;
    this._handlingClick = false;
    this.workspace = workspace;
    this._expanded = false;

  },

  onAdd: function (map) {
    this._initLayout();
    //this._update();
    return this._container;

  },

  onRemove: function (map) {
  },



  _initLayout: function () {
    var className = 'leaflet-control-legend',
      container = this._container = L.DomUtil.create('div', className);

    if (!L.Browser.touch) {
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.on(container, 'mousewheel', L.DomEvent.stopPropagation);
    } else {
      L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
    }

    if (this.options.collapsed) {
      L.DomEvent
        .on(container, 'click', this._toggle, this);
      var link = this._layersLink = L.DomUtil.create('i', "leaflet-control-legend-icon icon-list icon-white ", container);
      link.href = '#';
      link.title = 'Legenda';

      if (L.Browser.touch) {
        L.DomEvent
          .on(link, 'click', L.DomEvent.stopPropagation)
          .on(link, 'click', L.DomEvent.preventDefault)
          .on(link, 'click', this._toggle, this);
      } else {
        L.DomEvent.on(link, 'focus', this._toggle, this);
      }

      this._map.on('movestart', this._toggle, this);
      // TODO keyboard accessibility
    } else {
      this._toggle();
    }

  },
  _toggle: function () {
    if (this._expanded) {
      this._container.className = this._container.className.replace(' leaflet-control-legend-expanded', '');
      this._expanded = false;
    } else {
      L.DomUtil.addClass(this._container, 'leaflet-control-legend-expanded');
      this._expanded = true;
    }
  }
});
