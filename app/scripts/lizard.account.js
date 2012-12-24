Lizard.Account = {};

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
  Lizard.content.show(accountView);
  Backbone.history.navigate('account');
};

Lizard.addInitializer(function(){
  Lizard.Account.router = new Lizard.Account.Router({
    controller: Lizard.Account
  });
  
  Lizard.vent.trigger('routing:started');
});