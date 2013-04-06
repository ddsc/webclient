/* MENU VIEWS */

Lizard.Views.Menu = Backbone.Marionette.ItemView.extend({
	el: '#loginRegion',
	template: '#loggedin-template',
	events: {
		'click #login': 'doLogin',
		'click #logout': 'doLogout'
	},

	initialize: function(){
        this.model.on('change', this.render);
	},

	doLogin: function(e){
		// Redirect to the Single Sign On server.
		e.preventDefault();
		url = settings.login_token_url;
		$.getJSON(url, function(json) {
			window.location=json.login_url;
		});
	},

	doLogout: function(e){
		// Redirect to the Single Sign On server.
		e.preventDefault();
		url = settings.logout_token_url;
		$.getJSON(url, function(json) {
			window.location=json.logout_url;
		});
	}
});
