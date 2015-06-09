Franceconnect = {};
// Request FranceConnect credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Franceconnect.requestCredential = function (options, credentialRequestCompleteCallback) {
    // support both (options, callback) and (callback).
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({service: 'franceconnect'});
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(
            new ServiceConfiguration.ConfigError());
        return;
    }


    var credentialToken = Random.secret();
    var nonceToken = Random.secret();

    // var scope = (options && options.requestPermissions) || [];
    // var requiredScope = ['profile'];
    var scope = ['openid', 'email', 'profile']
    if (options.requestPermissions)
        scope = options.requestPermissions;
    // scope = _.union(scope, requiredScope);
    var flatScope = _.map(scope, encodeURIComponent).join('+');

    var loginStyle = OAuth._loginStyle('franceconnect', config, options);

    var loginUrl = 'https://fcp.integ01.dev-franceconnect.fr/api/v1/authorize' +
        '?response_type=code' +
        '&client_id=' + config.clientId +
        '&scope=' + flatScope +
        '&redirect_uri=' + OAuth._redirectUri('franceconnect', config) +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken) +
        '&nonce=' + OAuth._stateParam(loginStyle, nonceToken)

    var height = 620;
    if (_.without(scope, 'basic').length)
        height += 130;

    OAuth.launchLogin({
        loginService: "franceconnect",
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken,
        popupOptions: {width: 900, height: height}
    });
};