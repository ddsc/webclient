/*
Lizard Account information
*/


Lizard.Account = {};

// Lizard login handling

Lizard.Menu = {};
Lizard.Menu.DefaultLayout = Backbone.Marionette.Layout.extend({
  template: '#menu-template',
  regions: {
	  'loginRegion': '#loginRegion'
  }
});

Lizard.Account.LoginView = Backbone.Marionette.ItemView.extend({
	model: new Lizard.Models.Account(),
	tagName: 'a',
	template: '#login-template',
    attributes: {
		'href': '#'},

	events: {
		'click #login': 'doLogin'
	},

	initialize: function(){
		console.log('initialize LoginView');
		var that = this;
		this.model.fetch({
			success: function(model, response, data){
				if (model.attributes.authenticated === true){
					that.template = '#loggedin-template';
					that.render();
				}
			}
		});
	},

	doLogin: function(e){
		// Redirect to the Single Sign On server.
		e.preventDefault();
		url = settings.login_token_url;
		$.getJSON(url, function(json) {
			window.location=json.login_url;
		});
	}
});

// Lizard Account page
Lizard.Account.DefaultView = Backbone.Marionette.ItemView.extend({
  template: '#account-template',
  className: 'account'
});

Lizard.Account.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'account': 'account'
    }
});

Lizard.Account.account = function(){
  console.log('Lizard.Account.account()');
  var accountView = new Lizard.Account.DefaultView();

  menuView = new Lizard.Menu.DefaultLayout();
  loginView = new Lizard.Account.LoginView();

  Lizard.App.content.show(accountView);

  Lizard.App.menu.show(menuView);
  menuView.loginRegion.show(loginView.render());
  Backbone.history.navigate('account');
};

Lizard.App.addInitializer(function(){
  Lizard.Account.router = new Lizard.Account.Router({
    controller: Lizard.Account
  });

  Lizard.App.vent.trigger('routing:started');
});
