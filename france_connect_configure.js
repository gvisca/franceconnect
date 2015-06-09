Template.configureLoginServiceDialogForFranceconnect.helpers({
    siteUrl: function () {
        return Meteor.absoluteUrl();
    }
});

Template.configureLoginServiceDialogForFranceconnect.fields = function () {
    return [
        {property: 'clientId', label: 'key'},
        {property: 'secret', label: 'secret'}
    ];
};