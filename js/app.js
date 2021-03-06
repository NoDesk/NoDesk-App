// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','http-auth-interceptor','starter.controllers','ngCookies','ui.select'])

.config(function($httpProvider) {
      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.withCredentials = true;
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';

      //Remove the header used to identify ajax call  that would prevent CORS from working
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

.config(function ($compileProvider){
  // Set the whitelist for certain URLs just to be safe
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.config(function(uiSelectConfig) {
  uiSelectConfig.theme = 'bootstrap';
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
    .state("view", {
      url: '/view',
      templateUrl: 'template/view.html'
    })

})

.config(function(){
})

.run(function($ionicPlatform,databaseService) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    databaseService.start();
  });
})

.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
})

.factory('inputForm',function(){
  var inputTmp;
  var tmp={};
  
  tmp.getInput=function(){return inputTmp;}
  tmp.setInput=function(newInput){
            inputTmp=newInput;
         }

  return tmp;

})
/*
.factory('templateChoiceService',function(){
  var templateList=[];
  var selectedTemplate=[];
  var service={};
  
  service.getTemplateList=function(){return templateList;}
  service.setTemplateList=function(newTemplateList){
            templateList=newTemplateList;
         }
  
  service.getTemplate=function(){return templateList;}
  service.setTemplate=function(newTemplateList){
            templateList=newTemplateList;
         }

  return service;

})
*/
.factory('remoteService',function(){
  var remoteServer="localhost:8000";
  var server={};
  
  
  server.getRemote=function(){return remoteServer;}
  server.setRemote=function(newRemote){
            remoteServer=newRemote;
         }

  return server;
})

.factory('databaseService', function() {
  var db;   
  
  var service={
    // Open or create a new database if not found
    // Use Cordova sqlite plugin
    // API : https://github.com/brodysoft/Cordova-SQLitePlugin/blob/master/README.md
    start:function(){
      db = window.sqlitePlugin.openDatabase({name: "nodesk.db"});
      db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS template (idTemplate integer primary key, templateJSON text, alive boolean, timestamp integer)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS dossier (idDossier integer primary key,name text, dossierJSON text, timestamp integer,thumbnail text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS user (idUser integer primary key, name text, surname text, photo text, timestamp integer)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS option (idOption integer primary key, optionJSON text, timestamp integer)');
      })
    },
    get:function(){
      return {localDB:db};
    }
  }

  return service;
})

.factory('AuthenticationService', function($rootScope, $http, authService,remoteService,$cookieStore,$timeout) {
  var service = {
    login: function(user) {
      $http.post('https://'+remoteService.getRemote()+'/auth/login',"username="+encodeURI(user.username)+"&password="+encodeURI(user.password),{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
      //$http.post('http://localhost:8000/auth/login',user)
      .success(function (data, status, headers, config) {
    	 // $http.defaults.headers.common.Cookie = data.Set-Cookie;  // Step 1
        console.log('http://'+remoteService.getRemote()+'/auth/login',"username="+encodeURI(user.username)+"&password="+encodeURI(user.password)); 
        console.log(headers('Set-Cookie')); 
        $timeout(function(){console.log($cookieStore.get('session') )});
        $timeout(function(){console.log($cookieStore.get('sessionid') )});
        //$timeout(function(){console.log($cookieStore.get('csrftoken') )});
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


.factory('ErrorFormService', function() {
  var errorCompleteness=[];
  var service={};

  service.setError=function(errorArray){
    errorCompleteness=errorArray;
  };
  
  service.setError=function(){
    return errorCompleteness;
  };
  
  return service;
})

.factory('DossierSyncService', function($http, $state ,$q,$ionicLoading,remoteService,AuthenticationService,databaseService) {
  var currentID;
    
  var service = {
    getFile:function(dossierID,templateID){
      var deferred=$q.defer();
      $http.get("https://"+remoteService.getRemote()+"/dossier/"+templateID+"/"+dossierID).then(function(resp) {
        console.log('Success', resp);
        deferred.resolve(resp.data);
        // For JSON responses, resp.data contains the result
      }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
      })
      return deferred.promise;
    },
    
    getAllDossierFromTemplate:function(templateID){
      var deferred=$q.defer();
      $http.get("https://"+remoteService.getRemote()+"/dossier/"+templateID).then(function(resp) {
        console.log('Success', resp);
        deferred.resolve(resp.data);
        // For JSON responses, resp.data contains the result
      }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
      })
      return deferred.promise;
    },

    saveFile:function(dossierToSave){
      var currentDate = new Date();
      var dateTime = currentDate.getTime(); 

      if(isNew){
        databaseService.get().localDB.transaction(function(tx) {
          tx.executeSql("INSERT INTO dossier (dossierJSON, timestamp) VALUES (?,?)", [dossierToSave,dateTime]);
        })
      }
      else{
        databaseService.get().localDB.transaction(function(tx) {
          tx.executeSql("UPDATE dossier SET dossierJSON=?, timestamp=? WHERE idDossier=?", [dossierTosave,dateTime,currentID]);
        })
      }
    },
    
    sendFile:function(templateID,dossierToSend,templateJSON,thumbnail,dossierTitle){
        var preparedDossier={};
         
        console.log("to parse"+templateJSON);
        var parsed=JSON.parse(templateJSON);
        preparedDossier.dossier_name=dossierTitle.title;
        preparedDossier.dossier_thumbnail=thumbnail;
        for (var i = 0; i < dossierToSend.length; i++) {
          
          if (parsed[i].type=="Checkbox") {
              console.log(parsed[i]);
            for (var j = 0; j < parsed[i].value.length; j++) {
              var key=""+parsed[i].field_name+"_"+j;
              console.log(key);
              console.log("test2");
              preparedDossier[key]=dossierToSend[i].value[j].checked;
            };
          }
          else if(parsed[i].type=="Radiobox"){
            preparedDossier[parsed[i].field_name]=dossierToSend[i].result;
          }
          else{
            preparedDossier[parsed[i].field_name]=dossierToSend[i].value;
          }
        };
        
        console.log(preparedDossier);
        
        $http.post("https://"+remoteService.getRemote()+"/dossier/"+templateID,preparedDossier).then(function(resp) {
          console.log('Success', resp);
          // For JSON responses, resp.data contains the result
          $state.go('home');
          $ionicLoading.hide();
        }, function(err) {
          console.error('ERR', err);
          // err.status will contain the status code
          // TODO:show a popup saying that there was an error (network, refused, etc
          // ...)
        })
    },
    //Check if a template is completely filled
    //Checkbox due to their metaphore are not checked at all
    //Return an object where a boolean is set accordinly to completeness plus an
    //array of the missing field identified by their name 
    checkCompleteness:function(form){
      var nbField=form.length;
      var i;
      var j;
      var result={bool:true,where:[]};
      
      console.log(form);
      for(i=0;i<nbField;i++){
        //Common case
        if(form[i].type!='Radiobox' && form[i].type!='Checkbox'){
          if(form[i].value==null || form[i].value=="")
            result.bool=false;
            result.where.push(form[i].name);
        }
        //Special case radiobox
        else if(form[i].type=='RadioBox'){
          var nbChoice=form[i].values.length;
          var valid=false;
          for (var j = 0; j < nbChoice; j++) {
            if(form[i].values[j].checked==true){
              valid=true;
              break;
            }
          }
          if(!valid)
            result.bool=false;
            result.where.push(form[i].name);
        }
        //Checkbox are left unchecked
      }
      return result;
    }


  };

  return service;
})

.factory('UpdateListService', function() {
  var dossierInfo=[];
  var first=true;

  var service = {
    setDossierInfo:function (listDossierInfo,template) {
      if(first)
        first=false;
      else
        dossierInfo=[];

      for (var i = 0; i < listDossierInfo.length; i++) {
        for (var j = 0; j < listDossierInfo[i].length; j++) {
          listDossierInfo[i][j].tpl=template[i].name;
          dossierInfo.push(listDossierInfo[i][j])
        };
      };
      dossierInfo.reverse();
      console.log(dossierInfo)
    },
    getDossierInfo:function(){
      return {info:dossierInfo};
    }
  };

  return service;
})


.factory('LoadingService', function() {
  var alreadyDone=false;
  var items=[];
  var nbFiles=[];
  var template=[];

  var service = {
    getLoadingState:function(){
      return alreadyDone;
    },
    
    setLoadingState:function(bool){
      alreadyDone=bool;
    },
    
    setItem:function(itemCtrl,nbFilesCtrl){
      items=itemCtrl;
      nbFiles=nbFilesCtrl;
    },
    
    getItem:function(){
      return items;
    },

    getNbItem:function(){
      return nbFiles;
    },
    getTemplate:function(){
      return template;
    },
    setTemplate:function(templateCtrl){
      template=templateCtrl;
    }
  };

  return service;
})


.factory('ShareService', function() {
  var dossier={};
  var template=[];
  
  var service = {
    getDossier:function(){
      return dossier;
    },
    setDossier:function(newDossier){
      delete newDossier.$$hashKey;
      console.log(newDossier);
      return dossier=newDossier;
    },
    getTemplate:function(){
      return template;
    },
    setTemplate:function(newTemplate){
      console.log(newTemplate);
      return template=newTemplate;
    }
  };
  return service;
})

.factory('ThumbnailSlideService', function() {
  var thumbnail=[];

  var service = {
    addThumbnail:function (thumb,name,tplName,date) {
      var tmp={};
      tmp.src=thumb;
      tmp.name=name;
      tmp.tpl=tplName;
      tmp.date=date;
      console.log(tplName);
      thumbnail.push(tmp)
    },
    getThumbnail:function(){
      return {thumb:thumbnail};
    }
  };

  return service;
})


.factory('TemplateSyncService', function( $http, $state ,$q,remoteService,AuthenticationService) {
  //The full template list, loaded at start-up from the BD and updated by the
  //server.
  //When closing the app, the localDB is updated by this list, ensuring
  //pseudo-persistency when network problem occurs 
  var currentTemplateList=[];
  
  //Hold the full (json-added) template list response from the server
  var fetchedFullTemplateList=[];
  
  //Hold ther short template list response from the server
  var fetchedTemplateList;

  //Only hold the a template JSON 
  var fetchTemplateJSON;

  var choice;

  var service = {
    
    getTemplateList:function(){
      return fetchedFullTemplateList;
    },
    
    setChoice:function(item){
      choice=item;
    },
    
    getChoice:function(item){
      return choice;
    },

    //Update the specific template in the localDB
    updateTemplate:function(pk,updatedJSON){
      databaseService.get().localDB.transaction(function(tx) {
        tx.executeSql("UPDATE INTO template SET templateJSON=? where idTemplate=?", [updatedJSON,pk]);
      })
    },
    
    //Add a new template in the localDB
    createTemplate:function(pk,templateName,templateJSON){
      databaseService.get().localDB.transaction(function(tx) {
        tx.executeSql("INSERT INTO template (idTemplate,templateJSON,templateName) VALUES (?,?,?)", [pk,templateJSON,templateName]);
      })
    },
    
    //Load templates form the localDB into the currentTemplateList
    loadTplListFromDB:function(){
      //Clear the previous list
      currentTemplateList=[];
      
      //Load the template list from the localDB
      databaseService.get().localDB.transaction(function(tx) {
        tx.executeSql("SELECT * FROM template", [],
        function(transaction, result) {
          if (result != null && result.rows != null) {
            for (var i = 0; i < result.rows.length; i++) {
              var row = result.rows.item(i);
              var tpl={name: row.templateName,pk:row.idTemplate,json:row.templateJSON}
              currentTemplateList.push(tpl);
            }
          }
        },errorHandler)
      })
    },
    
    //Update the localDB from the currentTemplateList
    //Try to limit write on the localBD by checking the state of the current row
    //TODO: May be better performance-wise to just drop the whole table instead
    updateTplListToDB:function(){
        var i;
        var j;
        var currentListLength=currentTemplateList.length;
        var DBListlength;
        var tplListDB=[];
        
        //Load the template list from the localDB
        databaseService.get().localDB.transaction(function(tx) {
          tx.executeSql("SELECT * FROM template", [],
          function(transaction, result) {
            if (result != null && result.rows != null) {
              DBListLength=result.rows.lenght;
              for (var i = 0; i < DBListlength; i++) {
                var row = result.rows.item(i);
                var tpl={name: row.templateName,pk:row.idTemplate,json:row.templateJSON}
                tplListDB.push(tpl);
              }
            }
          },errorHandler)
        })
        
        //Compare the current template list with the one store in the database and
        //update or create rows accordingly
        for(i=0;i<listLength;i++){
          for(j=0;j<currentTplListLenght;j++){
          
            if(currentTemplateList[index].pk=tplListDB[j].pk){
              updateTemplate(pk);
            }
            else{
              createTemplate(pk);
            }
          }
        }
    },

    //refreshed the main list using data fetched from the server
    refreshTplList:function(){
      //Clear the previous list
      currentTemplateList=[];
      
      var i;
      var listLength=fetchedFullTemplateList.length;
      
      for(i=0;i<listLength;i++){
        CurrentList.push(fetchedFullTemplateList[i]);
      }
    },
    
    //API call to get alive template list 
    fetchTemplateList:function(full){
      var deferred=$q.defer();

      //Get list of full template from server
      if(full){
        $http.get("https://"+remoteService.getRemote()+"/template/?visible=true&json=true",{withCredentials :"true"}).then(function(resp) {
          console.log('Success', resp);
          fetchedFullTemplateList=resp.data;
          deferred.resolve(resp);
        });
      }
      //Get list of template from server
      else{
        $http.get("https://"+remoteService.getRemote()+"/template/?visible=true",{withCredentials :"true"}).then(function(resp) {
          console.log('Success', resp);
          fetchedTemplateList=resp.data;
          deferred.resolve(resp);
        });
      }
      return deferred.promise;
    },

    //API : Fetch a specific template 
    fetchTemplate:function(templateID){
      $http.get("http://"+remoteService.getRemote()+"/template/"+templateID,{withCredentials :"true"}).then(function(resp) {
        console.log('Success', resp);
        fetchedTemplateJSON=resp.data;
        }
        ,function(err) {
          console.error('ERR', err);
        })
    }
  };

  return service;
})

