/*
Lizard Account information
*/


Lizard.Account = {};

// Lizard login handling

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
  Lizard.App.content.show(accountView);
  Backbone.history.navigate('account');
};

Lizard.App.addInitializer(function(){
  Lizard.Account.router = new Lizard.Account.Router({
    controller: Lizard.Account
  });

  Lizard.App.vent.trigger('routing:started');
});
