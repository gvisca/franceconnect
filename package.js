Package.describe({
  summary: "FranceConnect OAuth flow",
  version: "0.1.0",
  name: "gvisca:franceconnect",
  git: "https://github.com/gvisca/franceconnect.git"
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Franceconnect');

  api.addFiles(
    ['france_connect_configure.html', 'france_connect_configure.js'],
    'client');

  api.addFiles('france_connect_server.js', 'server');
  api.addFiles('france_connect_client.js', 'client');
});