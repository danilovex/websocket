'use strict';

/*jshint esversion: 6 */
const express = require('express'),
      load = require('consign'),
      bodyParser = require('body-parser'),
      path = require('path');


module.exports = function(){
  var app = express();
    // all environments
  app.set('port', process.env.PORT || 3000);

  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');
  //app.use(express.favicon());
  //app.use(express.logger('dev'));
  //app.use(express.json());
  //app.use(express.urlencoded());
  //app.use(express.methodOverride());

  app.use('/public', express.static(path.join(__dirname, '../public')));
  app.use('/pages', express.static(path.join(__dirname, '../views/pages')));
  app.use('/css', express.static(path.join(__dirname, '../views/css')));
  app.use('/images', express.static(path.join(__dirname, '../views/images')));
  app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  load({
      cwd: 'server',
      verbose: false
    })
    .then('controllers')
    .then('routes')
    .into(app);

    return app;
};