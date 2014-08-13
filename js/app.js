// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers'])

.config(function($httpProvider) {
      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;

      //Remove the header used to identify ajax call  that would prevent CORS from working
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

.config(function ($compileProvider){
  // Set the whitelist for certain URLs just to be safe
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
  //.when('options','option.html')
    .otherwise('/');

  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: 'template/home.html'
    })
    .state("options", {
      url: '/options',
      templateUrl: 'template/option.html'
    })
    .state("editor", {
      url: '/editor',
      templateUrl: 'template/editor.html'
    })
    .state("browsing", {
      url: '/browsing',
      templateUrl: 'template/browse.html'
    })

})

.config(function(){
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    // Open or create a new database if not found
    // Use Cordova sqlite plugin
    // API : https://github.com/brodysoft/Cordova-SQLitePlugin/blob/master/README.md
    var db = window.sqlitePlugin.openDatabase({name: "nodesk.db"});
    
    db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS template (id integer primary key, templateJSON text, alive boolean, timestamp integer)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS dossier (id integer primary key, data dossierJSON, timestamp integer)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS user (id integer primary key, name text, surname text, photo text, timestamp integer)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS option (id integer primary key, optionJSON text, timestamp integer)');
    })
  });
})
