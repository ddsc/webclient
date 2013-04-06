Lizard.Models.Account = Backbone.Model.extend({
  url: settings.account_url,
  defaults: {
    authenticated: false,
    initialZoom: '5.16082763671875,51.95442214470791,7',//todo: use for initialisation of map
    initialPeriod: '1m',
    user: {
        username: '',
        first_name: '',
        last_name: ''
    }
  }
});
