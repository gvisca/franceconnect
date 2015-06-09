// Authorization endpoint : https://fcp.integ01.dev-franceconnect.fr/api/v1/authorize
// Token endpoint : https://fcp.integ01.dev-franceconnect.fr/api/v1/token
// UserInfo endpoint : https://fcp.integ01.dev-franceconnect.fr/api/v1/userinfo
// Endpoint de logout : https://fcp.integ01.dev-franceconnect.fr/api/v1/logout

Franceconnect = {};

OAuth.registerService('franceconnect', 2, null, function (query) {

    var response = getAccessToken(query);
    var accessToken = response.access_token;
    var idToken = response.id_token;
    var identity = getIdentity(accessToken);

    return {
        serviceData: {
            id: identity.sub,
            accessToken: accessToken,
            idToken: idToken,
            refreshToken: response.access_token,
            expiresAt: (+new Date) + (1000 * response.expires_in),
            name: identity.family_name
        },
        options: {
            profile: {
                name: identity.family_name,
                birthcountry: identity.birthcountry,
                birthplace: identity.birthplace,
                birthdate: identity.birthdate,
                given_name: identity.given_name,
                family_name: identity.family_name,
                gender: identity.gender,
                email: identity.email
            }
        }
    };
});


var getAccessToken = function (query) {
    var config = ServiceConfiguration.configurations.findOne({service: 'franceconnect'});
    if (!config)
        throw new ServiceConfiguration.ConfigError();

    var response;

    try {
        response = HTTP.post(
            "https://fcp.integ01.dev-franceconnect.fr/api/v1/token", {
                headers: {Accept: 'application/json'}, params: {
                    code: query.code,
                    client_id: config.clientId,
                    client_secret: OAuth.openSecret(config.secret),
                    grant_type: 'authorization_code',
                    redirect_uri: OAuth._redirectUri('franceconnect', config),
                    state: query.state
                }
            });
    } catch (err) {
        throw _.extend(new Error("Failed to complete OAuth handshake with Franceconnect. " + err.message),
            {response: err.response});
    }

    if (response.data.error) { // if the http response was a json object with an error attribute
        throw new Error("Failed to complete OAuth handshake with FranceConnect. " + response.data.error);
    } else {
        return response.data;
    }
};


var getIdentity = function (accessToken) {
    try {
        var response = HTTP.get(
            "https://fcp.integ01.dev-franceconnect.fr/api/v1/userinfo?schema=openid",
            {headers: {'Authorization': 'Bearer ' + accessToken}});
        return response.data;
    } catch (err) {
        throw _.extend(new Error("Failed to fetch identity from Franceconnect. " + err.message),
            {response: err.response});
    }
};


Franceconnect.retrieveCredential = function (credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};