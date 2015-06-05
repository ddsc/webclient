/* MENU VIEWS */

Lizard.Views.Menu = Backbone.Marionette.ItemView.extend({
	el: '#loginRegion',
	template: '#loggedin-template',
	events: {
		'click #login': 'doLogin',
		'click #logout': 'doLogout'
	},

	initialize: function(){
		// User information is gained through a script that puts this info on
		// the
		this.model.set('user', {
			first_name: window.user.firstName,
			last_name: '',
			username: window.user.userName
		});

		this.model.set('authenticated', window.user.authenticated);

		this.model.set('initialPeriod', '1m');

		this.model.on('change', this.render);
		this.render();
	},

	doLogin: function(e){
		// Redirect to the Single Sign On server.
		e.preventDefault();
		// Lizard-bs.js puts a logIn function on the window.
		window.logIn();
	},

	doLogout: function(e){
		// Redirect to the Single Sign On server.
		e.preventDefault();
		// Lizard-bs.js puts a logOUt function on the window.
		window.logOut();
	}
});
