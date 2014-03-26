// This is a customisation
L.Control.FullScreen = L.Control.extend({
	options: {
		position: 'topleft'
	},
	
	onAdd: function (map) {
		console.info('this is not even fired');
		var containerClass = 'leaflet-control-zoom', className, container;
		
		if(map.zoomControl) {
			container = map.zoomControl._container;
			className = '-fullscreen leaflet-bar-part leaflet-bar-part-bottom last';
            // Update class of the zoom out button (Leaflet v0.5)
            if (map.zoomControl._zoomOutButton) {
                L.DomUtil.removeClass(map.zoomControl._zoomOutButton, 'leaflet-bar-part-bottom');
            }
		} else {
			container = L.DomUtil.create('div', containerClass);
			className = '-fullscreen';
		}
		
		this._createButton('Full Screen', containerClass + className, container, window.toggleFullScreen, map);

		return container;
	},
	
	_createButton: function (title, className, container, fn, context) {
		var link = L.DomUtil.create('a', className, container);
		link.href = '#';
		link.title = title;

		L.DomEvent
			.addListener(link, 'click', L.DomEvent.stopPropagation)
			.addListener(link, 'click', L.DomEvent.preventDefault)
			.addListener(link, 'click', fn, context);
		
		return link;
	},
	
	toogleFullScreen: function () {
		// this has become obsolete. See utilities.js window.toggleFullScreen
		// also this is spelled incorrectly :)
	},
	
	_handleEscKey: function () {
		if(!fullScreenApi.isFullScreen(this) && !this._exitFired){
			this.fire('exitFullscreen');
			this._exitFired = true;
		}
	}
});

