Lizard.Management = {};

Lizard.Management.DefaultView = Backbone.Marionette.Layout.extend({
  template: '#management-template',
  templateHelpers: {
    management_ui_url: settings.management_ui_url
  },
  className: 'management',
  onShow: Lizard.Visualsearch.init,
  onDomRefresh: function() {
    console.log('onDomRefresh');
  },
  regions: {
  },
  onShow: function () {
    $('#content').parent().addClass('full-width');
  },
  onClose: function() {
    $('#content').parent().removeClass('full-width');
  }
});

Lizard.Management.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'management': 'management'
    }
});

Lizard.Management.management = function(){
  console.log('Lizard.Management.mangement()');

  Lizard.managementView = new Lizard.Management.DefaultView({

  });
  Lizard.App.content.show(Lizard.managementView);

  Backbone.history.navigate('management');
};

Lizard.App.addInitializer(function(){
  Lizard.Management.router = new Lizard.Management.Router({
    controller: Lizard.Management
  });
});
