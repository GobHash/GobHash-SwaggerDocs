'use strict'

var fs = require('fs');
var express = require('express');

var favIconHtml = '<link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />' +
                  '<link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />'


var setup = function(swaggerDoc, explorer, options, customCss, customfavIcon, swaggerUrl, customeSiteTitle) {
	options = options || {};
  var explorerString = explorer ?  '' : '.swagger-ui .topbar .download-url-wrapper { display: none }';
    customCss = explorerString + ' ' + customCss || explorerString;
    customfavIcon = customfavIcon || false;
    customeSiteTitle = customeSiteTitle || 'Swagger UI';
	var html = fs.readFileSync(__dirname + '/indexTemplate.html');
  try {
  	fs.unlinkSync(__dirname + '/index.html');
  } catch (e) {

  }

  var favIconString = customfavIcon ? '<link rel="icon" href="' + customfavIcon + '" />' : favIconHtml;
  var htmlWithCustomCss  = html.toString().replace('<% customCss %>', customCss);
  var htmlWithFavIcon  = htmlWithCustomCss.replace('<% favIconString %>', favIconString);

  var initOptions = {
    swaggerDoc: swaggerDoc || undefined,
    customOptions: options,
    swaggerUrl: swaggerUrl || undefined
  }
  var htmlWithOptions = htmlWithFavIcon.replace('<% swaggerOptions %>', JSON.stringify(initOptions)).replace('<% title %>', customeSiteTitle)
  
  return function(req, res, next) {
    if (req.url === '/' ) {
      if (req.user) {
        res.send(htmlWithOptions);
      } else {
        res.redirect('/login');
      }
    }
    else {
      next();
    }
  };

};

var serve = express.static(__dirname + '/static');

var stringify = function(obj, prop) {
  var placeholder = '____FUNCTIONPLACEHOLDER____';
  var fns = [];
  var json = JSON.stringify(obj, function(key, value) {
    if (typeof value === 'function') {
      fns.push(value);
      return placeholder;
    }
    return value;
  }, 2);
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function(_) {
    return fns.shift();
  });
  return json + ';';
};

module.exports = {
	setup: setup,
	serve: serve
};
