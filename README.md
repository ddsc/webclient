# DDSC Webclient

**DDSC Webclient** is a javascript application built with [Backbone](http://backbonejs.org/), [Backbone-Marionette](http://marionettejs.com/), [Twitter Bootstrap](http://twitter.github.com/bootstrap/), [jQuery](http://jquery.com/), [Leaflet](http://leafletjs.com/) and [more](https://github.com/ddsc/webclient/tree/master/app/scripts/vendor)...

## Demo

Not much to see here yet, as we're mostly experimenting with Backbone, Marionette and Modelbinder.

[http://ddsc.github.com/webclient/](http://ddsc.github.com/webclient/)


## Installation

We use [Yeoman](http://yeoman.io/) and [Grunt.js](http://gruntjs.com/) to facilitate building (minification/concatenation) of the production assets.
Run the following commands to install yeoman. We prefer to install it in a [Vagrant](http://vagrantup.com/) environment:

    sudo apt-get install python-software-properties
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs npm
    sudo npm install -g yeoman
    sudo npm install phantomjs
    sudo gem install compass

Start the webserver after the installation:

    cd webclient
    yeoman server

And point a browser to localhost 3051.
The 'yeoman server' step is optional, you can also serve it with nginx, apache or just: 
    
    $ python -m SimpleHTTPServer



## Tests

If you've installed yeoman, you should be able to run the Mocha test-suite from the commandline as such:

    $ yeoman test
    Testing index.html...........OK
    >> 11 assertions passed (0s)

    Done, without errors.    

This is perfect for automated testing or for CI systems like Jenkins or Travis.
Assuming you're serving the project root using a webserver, you should be able to point your browser to test/index.html.
This will show the test suite in HTML format. Use this to spot errors.

** Note ** The test/index.html file includes the project's javascript files. It also contains all the template fragments, which is obviously not ideal. 
Perhaps we should start externalizing these templates so they can be included.



## Mock API

Because of parallel front-end and back-end development, at some point we're in need of a fake/mock/stub API, so we can create a responsive interface.
This API was hacked together using node.js/PostGIS and lives here: https://github.com/ddsc/ddsc-node-mock-api

 * Clone that repo somewhere you like
 * Install node.js and npm (you probably have those already, see above)
 * Install PostGIS (ask around if you don't know where to start), load the file dumpddsc.sql
 * Run 'npm install -d' to install the packages required such as Express.js and the non-blocking node-postgres library
 * Run 'node app.js' to run the API on port 3000
 * Make sure to reference the proper IP and port in app/localsettings.js (this is just during development)
 * Enjoy


## Technology choices

 * All of the choices have one set of philosophies in common: They don't try to do everything, they're explicit (as opposed to magical), they're close enough to the DOM to understand and thus debug/expand. Also, most of them are used in production all over the web.

 * Why Marionette? Because it provides Backbone with a View layer, which it is intentionally lacking by default. We tried Ember, Knockout, ExtJS4, but Backbone.Marionette seems to have the proper balance when it comes to the aforementioned philosophies.

 * Backbone also lacks an official Controller layer, which is where [Backbone-Geppetto](http://modeln.github.com/backbone.geppetto/) could come in handy in the future.

 * Twitter Bootstrap provides sensible defaults for modern gridded layouts and responsive interfaces while not (really) getting in the way.

 * Leaflet is very fast on mobile Webkit devices thanks to CSS3 hardware accelerated transformations. It also has a clean API, unlike OpenLayers 2.x (may change with OL3).


## Application structure

 * The idea is to serve as few assets as possible, thus reducing HTTP requests to only a handful: index.html, minified app.js, minified style.css and a sprite.png

 * We're currently not using AMD/require.js for simplicity's sake. This implies that the loading order of the JS files matters.

 * 3rd party code goes in app/scripts/vendor

 * main.js contains the application bootstrapping code.

 * For every tab in the application, there's a file named 'lizard.tabname.js'

 * Specific functionality, such as the map code, should be wrapped as much as possible in JS modules.

 * Underscore templates (could be Handlebars.js or something else in the future) are hardcoded in index.html for now.


## Documentation

### Marionette

 * [Marionette documentation index](https://github.com/marionettejs/backbone.marionette/tree/master/docs)

 * [Marionette Application](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.md)

 * [Marionette Application Module](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.module.md)

 * [Marionette AppRouter](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.approuter.md)

 * [Marionette Callbacks](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.callbacks.md)

 * [Marionette CollectionView](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.collectionview.md)

 * [Marionette Commands](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.commands.md)

 * [Marionette CompositeView](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.compositeview.md)

 * [Marionette Controller](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.controller.md)

 * [Marionette EventAggregator](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.eventaggregator.md)

 * [Marionette EventBinder](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.eventbinder.md)

 * [Marionette functions](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.functions.md)

 * [Marionette ItemView](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.itemview.md)

 * [Marionette Layout](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.layout.md)

 * [Marionette Region](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.region.md)

 * [Marionette Renderer](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.renderer.md)

 * [Marionette Request and Reponse](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.requestresponse.md)

 * [Marionette TemplateCache](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.templatecache.md)

 * [Marionette View](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.view.md)

 * [Managing layouts and nested views with Backbone-marionette](http://lostechies.com/derickbailey/2012/03/22/managing-layouts-and-nested-views-with-backbone-marionette/)

 * [The relationship between regions and layouts](https://github.com/marionettejs/backbone.marionette/wiki/The-relationship-between-regions-and-layouts)

 * [What's the difference between a Marionette Layout and a Region?](http://stackoverflow.com/questions/10521266/whats-the-difference-between-a-marionette-layout-and-a-region)

 * [Loads of Backbone.js plugins](https://github.com/documentcloud/backbone/wiki/Extensions,-Plugins,-Resources)

 ## Far Future Philosophy

 If this API centered and Javascript powered approach proves to be a successful way of implementing an application, we'll continue down this path. Examples of other companies in the same domain who've taken this approach are:


 * Mapbox with [mapbox.js](http://mapbox.com/mapbox.js/)

 * CartoDB with [cartodb.js](https://github.com/CartoDB/cartodb.js)
 
 * [Google](https://code.google.com/p/google-api-javascript-client/source/browse/samples/authSample.html)
 
