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

            this.model.set('initialPeriod', $form.find('[name="timeperiod"]:checked').val());
            this.model.save(null)
                .done(function (model, response) {
                    $('.top-right').notify({message: {text: 'Voorkeuren opgeslagen.'}}).show();
                })
                .fail(function (model, response) {
                    $('.top-right').notify({message: {text: 'Actie mislukt. (' + response.responseText + ')'}}).show();
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
};

Lizard.App.addInitializer(function() {
    Lizard.Account.router = new Lizard.Account.Router({
        controller: Lizard.Account
    });
});
