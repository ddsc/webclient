# DDSC Webclient

**DDSC Webclient** is a javascript application built with [Backbone](http://backbonejs.org/), [Backbone-Marionette](http://marionettejs.com/), [Twitter Bootstrap](http://twitter.github.com/bootstrap/), [jQuery](http://jquery.com/), [Leaflet](http://leafletjs.com/) and [more](https://github.com/ddsc/webclient/tree/master/app/scripts/vendor)...

Start the webserver after checking out the repo. All you need is a simple HTTP server :

    cd webclient
    python -m SimpleHTTPServer

A BIG problem however is that you also have to checkout the ddsc-api libraries and run the server to get the client to work locally because of Cross-Origin security on the api. You can of course mock the whole thing (see Mock API below). But that is obviously not a very stable solution.
Another solution, if you solely need to fix some frontend bugs (without API changes that is), configure your localhost to point to the API URL to prevent CORS problems.


## Deployment
Add Chris Lea's node.js ppa and install node and grunt::
    sudo apt-get install python-software-properties
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs rubygems
    sudo gem install compass # needed for css concatenation and minification
    sudo npm install -g grunt-cli
    npm install # installs local dependencies
    grunt build


## Coding hints / tips

 * Using .get() and .set() is preferred over attributes (Backbone)
 * Initializing views, collections, models should be done in the appropiate places: for application wide stuff, do it in lizard.app.js, for page-specific things, do it on the pagename.lizard.js.
 * Views in seperate files under lizard/views/ClassName.js
 * Models and collections should for now be in lizard.models.js and lizard.collections.js (because they're usually small)
 * Templates: single lines/small templates may be used 'inline' in the view-code. Large chunks deserve a place in index.html for the designers merit (or later, external and loaded async).
 



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

