// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','http-auth-interceptor','starter.controllers'])

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
    .otherwise('/login');

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
    .state("login", {
      url: '/login',
      templateUrl: 'template/login.html'
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
      tx.executeSql('CREATE TABLE IF NOT EXISTS template (idTemplate integer primary key, templateJSON text, alive boolean, timestamp integer)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS dossier (idDossier integer primary key,name text, dossierJSON text, timestamp integer,thumbnail text)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS user (idUser integer primary key, name text, surname text, photo text, timestamp integer)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS option (idOption integer primary key, optionJSON text, timestamp integer)');
    })
  });
})

.factory('remoteService',function(){
  var remoteServer="localhost:8000";
  var server={};
  
  
  server.getRemote=function(){return remoteServer;}
  server.setRemote=function(newRemote){
            remoteServer=newRemote;
         }

  return server;
})

.factory('AuthenticationService', function($rootScope, $http, authService,remoteService) {
  var service = {
    login: function(user) {
      $http.post('https://'+remoteService.getRemote()+'/auth/login',"username="+encodeURI(user.username)+"&password="+encodeURI(user.password),{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
      //$http.post('http://localhost:8000/auth/login',user)
      .success(function (data, status, headers, config) {
    	 // $http.defaults.headers.common.Cookie = data.Set-Cookie;  // Step 1
        console.log('http://'+remoteService.getRemote()+'/auth/login',"username="+encodeURI(user.username)+"&password="+encodeURI(user.password)); 
    	  // Need to inform the http-auth-interceptor that
        // the user has logged in successfully.  To do this, we pass in a function that
        // will configure the request headers with the authorization token so
        // previously failed requests(aka with status == 401) will be resent with the
        // authorization token placed in the header
        authService.loginConfirmed(data, function(config) {  // Step 2 & 3
          //config.headers.Authorization = data.authorizationToken;
          return config;
        });
      })
      .error(function (data, status, headers, config) {
        $rootScope.$broadcast('event:auth-login-failed', status);
      });
    },
    logout: function(user) {
      $http.post('https://logout', {}, { ignoreAuthModule: true })
      .finally(function(data) {
        //delete $http.defaults.headers.common.Authorization;
        $rootScope.$broadcast('event:auth-logout-complete');
      });			
    },	
    loginCancelled: function() {
      authService.loginCancelled();
    }
  };
  return service;
})

