var express = require('express');
var app = express();
var swaggerUi = require('../../index');
var swaggerDocument = require('./swagger.json');

app.use((req, res, next) => {
	if (req.url === '/favicon.ico') {
		res.sendFile(__dirname + '/favicon.ico');
	} else if (req.url === '/swagger.json') {
		res.sendFile(__dirname + '/swagger.json');
	} else {
		next();
	}
});

var options = {
	validatorUrl : null,
	oauth: {
	 clientId: "your-client-id1",
	 clientSecret: "your-client-secret-if-required1",
	 realm: "your-realms1",
	 appName: "your-app-name1",
	 scopeSeparator: ",",
	 additionalQueryStringParams: {}
 },
 docExpansion: 'full'
};

app.get('/test', function(req, res) { res.json({ status: 'OK'}); });
app.get('/bar', function(req, res) { res.json({ status: 'OKISH'}); });

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, false, {}, '.swagger-ui .topbar { background-color: rgb(112, 111, 111); }'));
app.use('/api-docs-from-url', swaggerUi.serve)
app.get('/api-docs-from-url', swaggerUi.setup(null, false, options, '.swagger-ui .topbar { background-color: red }', null, '/swagger.json'));

app.use(function(req, res) {
    res.send(404, 'Page not found');
});

module.exports = app;
