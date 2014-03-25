/*
 Lizard Account information
 */

Lizard.Account = {};

Lizard.Account.View = Backbone.Marionette.ItemView.extend({
    template: '#account-template',
    className: 'account',
    initialize: function(options) {
        this.model.on('change', this.render, this);
        this.model.on('save', this.save, this);
    },
    events: {
        'submit #preferences-form': function(e) {
            if (e) {
                e.preventDefault();
            }

            var $form = $(e.target);
            var $btn = $form.find('[type="submit"]');
            $btn.attr('disabled', 'disabled');

            this.model.set({
                'initialPeriod': $form.find('[name="timeperiod"]:checked').val(),
                'initialZoom': $form.find('[name="initialzoom"]').val(),
                'panner': $form.find('[name="panner"]').val()
            });
            this.model.save(null)
                .done(function (model, response) {
                    $('.top-right').notify({message: {text: 'Voorkeuren opgeslagen.'}}).show();
                })
                .fail(function (model, response) {
                    $('.top-right').notify({type: 'warning', message: {text: 'Actie mislukt. (' + response.responseText + ')'}}).show();
                })
                .always(function (model, response) {
                    $btn.removeAttr('disabled');
                });
        }
    },
    onRender: function(e) {
        this.$el.find('input[name="timeperiod"][value="' + this.model.get('initialPeriod') + '"]').attr('checked', true);
    }
});

Lizard.Account.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        'account': 'accountRoute'
    }
});

Lizard.Account.accountRoute = function() {
  // Apparantly, 'account' is a global instance model, like
  // workspaceCollection et al. It's initialized in lizard.app.js,
  // but only AFTER this code is executed.
  accountView = new Lizard.Account.View({
      model: account
  });
  Lizard.App.content.show(accountView);

  tour = new Tour({
    labels: {
        next: "Verder »",
        prev: "« Terug",
        end: "Einde uitleg"
    },
    useLocalStorage: false,
    backdrop: true
  });
  tour.addStep({
      element: "#profile_link",
      title: "Profiel",
      placement: "right",
      content: "Via deze link komt u op een pagina, waar u uw profiel kunt beheren."
  });
  tour.addStep({
    element: "#timeperiod-controls",
    title: "Default periode",
    placement: "right",
    content: "Stel hier u default tijdsperiode in."
  });
  tour.addStep({
    element: "#default-location",
    title: "Default zoom",
    placement: "right",
    content: "Stel hier uw default zoom in van de kaart. Het formaat is latitude, longitude en zoomniveau, " +
      "Gescheiden door een komma. " +
      "Als u op de kaart zoomt naar het gebied dat u wilt zien, dan kunt u in de adresbalk het deel na de '/'" +
      "kopiëren en hier invullen (als voorbeeld: 5.1608276367,51.95442214470,7 "
  });

};

Lizard.App.addInitializer(function() {
    Lizard.Account.router = new Lizard.Account.Router({
        controller: Lizard.Account
    });
});
