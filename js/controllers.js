/*
 * TODO: Remove all console.log when releasing 
 * */


angular.module('starter.controllers', ['ui.bootstrap','textAngular'])

.controller('AppCtrl',function($scope,$ionicModal){
  $scope.showNext=false;
  $scope.firstUse=true;

  document.addEventListener("resume",function() {
    console.log("resume");
    if($scope.showNext)
      $scope.modal.show();
  }, false);

  document.addEventListener("pause",function() {
    console.log("resume");
    if(!$scope.firstUse)
      $scope.showNext=true;
    else
    $scope.firstUse=false;
  }, false);
  
  $ionicModal.fromTemplateUrl('template/pinModal.html',function(modal){
      $scope.loginModal=modal;
    },
    {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

  $scope.openPINModal = function() {
    if(showNext)
      $scope.modal.show();
  };

  $scope.closePINModal = function() {
    $scope.modal.hide();
  };
  

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });

  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

})

.controller('DropdownCtrl', function($scope) {
  $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    console.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };
})

.controller('CarouselCtrl', function($scope) {
  
})

.controller('BrowseCtrl', function($scope) {
  $scope.items=[];

  $scope.items = [[
    'The first choice!',
    'And another choice for you.',
    'And another choice for you2.',
    'but wait! A third!'
  ],
  ['hurr','durr','toto','test']];
  
  //Convert unix timestamp to date 
  //return a string of the converted timestamp
  function timeConverter(UNIX_timestamp){
    var date = new Date(unix_timestamp*1000);
    // hours part from the timestamp
    var hours = date.getHours();
    // minutes part from the timestamp
    var minutes = date.getMinutes();
    // seconds part from the timestamp
    var seconds = date.getSeconds();

    // will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes + ':' + seconds;
    return formattedTime;
  }
  
  //load dossier from the localDB
  $scope.loadDossier=function(){
    var i,j=0;

    $scope.localDB.transaction(function(tx) {
      tx.executeSql("SELECT * FROM Dossier", [],
      function(transaction, result) {
        if (result != null && result.rows != null) {
          DBListLength=result.rows.lenght;
          for (var i = 0; i < DBListlength; i++) {
            var row = result.rows.item(i);
            var cover={date:null,name:null,thumb:null}
            
            //Row of 4 element 
            if(i%4==0){
              items.push([]);
              j++;
            }

            cover.date=timeconverter(row.timestamp);
            cover.name=row.name;
            cover.thumb=row.thumbnail;
            items[j].push(cover);
          }
        }
      },errorHandler)
    });
  };

  $scope.addCover=function(cover){
    if(items[items.length].length>4){
      items.push([]);
      items[items.length].push(cover)
    }
    else{ 
      items[items.length].push(cover)
    }
  }

})


.controller('ChatListCtrl', function($scope) {
  $scope.items = [
    { 
      name:"Charles",
      short:"Lorem ipsum",
      imagePath:"photoAvatar.jpg",
      status:"connected"
    },
    { 
      name:"Eleanor",
      short:"Lorem ipsum ",
      imagePath:"user2.png",
      status:"occupied"
    },
    { 
      name:"Alacoque",
      short:"Lorem ipsum ",
      imagePath:"user3.jpg",
      status:"away"
    }
  ];
  
})

.controller('UpdateListCtrl', function($scope) {

  $scope.items = [
    'Hello 1',
    'Hello, world 2!',
    'Hello, world 3!'
  ];

})

.controller('HeaderCtrl', function($scope,$location,$state,$ionicSideMenuDelegate) {
  
  $scope.goToOption= function(){
    $state.go("options");
  };
  
  $scope.goToMain= function(){
    $state.go("home");
  };
  
  $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

})

.controller('MainButtonCtrl', function($scope,$location,$state,$ionicSideMenuDelegate) {
  $ionicSideMenuDelegate.canDragContent(true);

  $scope.goTo= function(e){
    $state.go(e);
    console.log(e);
  };

})
.controller('InputCtrl', function($scope,inputForm) {

  $scope.updateFromInput=function(test){
    inputForm.setInput(test);
    alert(test.files[0].name);
  };

})
.controller('EditorCtrl', function($scope,$sce,$state,$ionicPopup, $timeout,$ionicModal,$http,inputForm) {
  $scope.currentTemplate;
  
  /*Cordova/phonegap */ 
  
  /*Camera - Get Picture
   * API links : https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md
   **/
  
  
  $scope.getPicture=function(imageField){  
    
    navigator.camera.getPicture(
      function(imageData){ imageField.value = "data:image/jpeg;base64," + imageData;},
      function(message){ alert('Failed because: ' + message);},
      { quality: 50, destinationType: Camera.DestinationType.DATA_URL}
    );
  };
  
  $scope.getPictureFromDevice=function(imageField){  
    
    navigator.camera.getPicture(
      function(imageData){ imageField.value = "data:image/jpeg;base64," + imageData;},
      function(message){ alert('Failed because: ' + message);},
      { quality: 50, destinationType: Camera.DestinationType.DATA_URL, sourceType:Camera.PictureSourceType.PHOTOLIBRARY}
    );
  };
  
  $scope.getAudio=function(soundField){
    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
        //TODO: load into value as a base64 string
        soundField.value=path;

    };

    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };

    // start audio capture
    navigator.device.capture.captureAudio(captureSuccess, captureError, {limit:1});
  };
  
  $scope.getVideo=function(videoField){
    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
        //TODO:load video file as a base64 string
        alert(path);
        video.field.value=path;
    };

    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };

    // start video capture
    navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:1});
  };
  /*GPS - Get Position
   * API links : https://github.com/apache/cordova-plugin-geolocation/blob/master/doc/index.md
   **/
  


  $scope.getCoordinate=function(coordinateField){
    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    var onSuccess = function(position) {
      alert('Latitude: '          + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');
      coordinateField.value=position.coords.latitude+","+position.coords.longitute;
    };
    
    // onError Callback receives a PositionError object
    //
    function onError(error) {
      alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError,{maximumAge:3000,timeout:5000,enableHighAccuracy:true});

  };

  $scope.goTo= function(e){
    $state.go(e);
    console.log(e);
  };
  
  $scope.test=function(){
  }
  
  $scope.addImage=function(refValue){
    var myPopup = $ionicPopup.show({
    title: 'Selectionner image',
    scope: $scope,
    buttons: [
      { type: 'button button-icon icon ion-folder',
        onTap: function() {
            //Cordova/phoneGap Files explorer
            //MIME-type image
            $scope.getPictureFromDevice(refValue);
            return ;
        }
      },
      { type: 'button button-icon icon ion-camera',
        onTap: function() {
            //Cordova/phoneGap camera 
            $scope.getPicture(refValue);
            return ;
        }
      },
    ]
    });
    /*
    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });
    
    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
    */
  };
  
  $scope.showImage=function(){
    alert($scope.currentTemplate[2].value);
  };
  

  $scope.addSound=function(refValue){
    var myPopup2 = $ionicPopup.show({
    title: 'Selectionner fichier audio', 
    template:'<div  class="fileinputs"> <input  ng-controller="InputCtrl" type="file" class="file" onchange=angular.element(this).scope().updateFromInput(this) /> <div class="fakefile icon ion-folder"> </div> </div>',
    scope: $scope,
    buttons: [
      { type: 'button button-icon icon ion-folder',
        onTap: function() {
            //Cordova/phoneGap Files explorer
            //MIME-type audio 
            refValue.value=inputForm.getInput().files[0];
            return;
        }
      },
      { type: 'button button-icon icon ion-ios7-mic',
        onTap: function() {
            //Cordova/phoneGap microphone
            $scope.getAudio(refValue);
            return;
        }
      },
    ]
    });
    /*
    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });
    
    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
    */
  };
   
  //Take a screenshot of the currently displayed dossier  
  $scope.storeCanvas=function(){

    document.querySelector(".view").style.overflow = "visible";
    document.querySelector(".has-header.scroll-content.ionic-scroll.has-subheader").style.overflow = "visible";
    document.querySelector(".menu-content.pane.disable-user-behavior").style.overflow = "visible";
    //scroll.removeAttribute("style");
    html2canvas(document.querySelector("#currentFile"), {
      allowTaint:'true',
      useOverflow:'false',
      onrendered: function(canvas) {

        var base64 = canvas.toDataURL();
        console.log(base64);
        document.querySelector(".view").style.overflow = "hidden";
        document.querySelector(".has-header.scroll-content.ionic-scroll.has-subheader").style.overflow = "hidden";
        document.querySelector(".menu-content.pane.disable-user-behavior").style.overflow = "hidden";
    }
    });
  };


  $scope.addVideo=function(refValue){
    var myPopup3 = $ionicPopup.show({
    title: 'Selectionner video',
    scope: $scope,
    template:'<div  class="fileinputs"> <input  ng-controller="InputCtrl" type="file" class="file" onchange=angular.element(this).scope().updateFromInput(this) /> <div class="fakefile icon ion-folder"> </div> </div>',
    buttons: [
      { type: 'button button-icon icon ion-folder',
        onTap: function() {
            //Cordova/phoneGap Files explorer
            //MIME-type video 
            refValue.value=inputForm.getInput().files[0];
            return;
        }
      },
      { type: 'button button-icon icon ion-videocamera',
        onTap: function() {
            //Cordova/phoneGap camera/video
            $scope.getVideo(refValue)
            return;
        }
      },
    ]
    });
    /*
    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });

    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
    */
  };
  
  $scope.addCoordinate=function(refValue){
    var myPopup3 = $ionicPopup.show({
    title: 'Geo-localistion',
    subtitle: "GPS ou adresse",
    template: '<input type="text" class="form-control" placeholder="Text input">',
    scope: $scope,
    buttons: [
      { type: 'button button-icon icon ion-location',
        onTap: function() {
            //Cordova/phoneGap gps
            $scope.getCoordinate(refValue);
            return;
        }
      }
    ]
    });
    /*
    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });

    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
    */
  };
  

  //Check if a template is completely filled
  //Checkbox due to their metaphore are not checked at all
  //Return an object where a boolean is set accordinly to completeness plus an
  //array of the missing field identified by their name 
  $scope.checkCompleteness=function(form){
    var nbField=form.length;
    var i;
    var j;
    var result={bool:true,where:[]};

    for(i=0;i<nbField;i++){
      //Common case
      if(form[i].type!='Radiobox' && form[i].type!='Checkbox'){
        if(form[i].values==null)
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

  $scope.osmURL=function(coord){
        var gps1=(coord.split(",")[1]-0.1); 
        var gps2=(coord.split(",")[0]-0.1 ); 
        var gps3=(coord.split(",")[1]+0.1); 
        var gps4=(coord.split(",")[0]+0.1);
        var baseURL="http://www.openstreetmap.org/export/embed.html?bbox=" +gps1+'%2C'+gps2+'%2C'+gps3+'%2C'+gps4+'&amp;layer=mapnik'; 
    
    return $sce.trustAsResourceUrl(baseURL);
  };

  $scope.parseTemplate=function(/*templateJSON*/){
    //var tpl=JSON.parse(templateJSON)
    
    var tpl=[ { type: 'TextArea', name: 'TextArea_', value: 'TextArea' },
    { type: 'TextLine', name: 'TextLine_', value: 'TextLine' },
    { type: 'Image', name: 'Image_', value: 'img/image.svg' },
    { type: 'Sound', name: 'Sound_', value: 'template_test.yaml' },
    { type: 'Video', name: 'Video_', value: 'template_test.yaml' },
    { type: 'Coordinates', name: 'Coordinates_', value: '43.2,42.0' },
    { type: 'Date', name: 'Date_', value: '01/01/2000' },
    { type: 'Time', name: 'Time_', value: '12:00' },
    { type: 'User', name: 'User_', value: 'User' },
    { type: 'Creator', name: 'Creator_', value: 'Creator' },
    { type: 'Email', name: 'Email_', value: 'test@email.com' },
    { type: 'Phone', name: 'Phone_', value: '00 00 00 00 00' },
    { type: 'Radiobox',
      name: 'Radiobox_',
      value: [ 42, 'ok', 'maybe' ], 
      result:''},
    { type: 'Checkbox',
      name: 'Checkbox_',
      value: [ {text:'check1',checked:false},{text:'check2',checked:false},{text:'check3',checked:false} ] },
    { type: 'Number', name: 'Number_', value: 42 } ];
      
    $scope.currentTemplate=tpl;
  };
  

  $scope.data={ htmlcontent1:'<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li style="color: blue;">Super Easy <b>Theming</b> Options</li><li>Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li>Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>',htmlcontent2:'test'}
})

.controller('TemplateSyncCtrl', function($scope, $http, $state ,remoteService,AuthenticationService) {
  //The full template list, loaded at start-up from the BD and updated by the
  //server.
  //When closing the app, the localDB is updated by this list, ensuring
  //pseudo-persistency when network problem occurs 
  $scope.currentTemplateList=[];
  
  //Hold the full (json-added) template list response from the server
  $scope.fetchedFullTemplateList=[];
  
  //Hold ther short template list response from the server
  $scope.fetchedTemplateList;

  //Only hold the a template JSON 
  $scope.fetchTEmplateJSON;
  
  //Update the specific template in the localDB
  $scope.updateTemplate=function(pk,updatedJSON){
    $scope.localDB.transaction(function(tx) {
      tx.executeSql("UPDATE INTO template SET templateJSON=? where idTemplate=?", [updatedJSON,pk]);
    })
  };
  
  //Add a new template in the localDB
  $scope.createTemplate=function(pk,templateName,templateJSON){
    $scope.localDB.transaction(function(tx) {
      tx.executeSql("INSERT INTO template (idTemplate,templateJSON,templateName) VALUES (?,?,?)", [pk,templateJSON,templateName]);
    })
  };
  
  //Load templates form the localDB into the $scope.currentTemplateList
  $scope.loadTplListFromDB=function(){
    //Clear the previous list
    $scope.currentTemplateList=[];
    
    //Load the template list from the localDB
    $scope.localDB.transaction(function(tx) {
      tx.executeSql("SELECT * FROM template", [],
      function(transaction, result) {
        if (result != null && result.rows != null) {
          for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            var tpl={name: row.templateName,pk:row.idTemplate,json:row.templateJSON}
            $scope.currentTemplateList.push(tpl);
          }
        }
      },errorHandler)
    })
  };
  
  //Update the localDB from the $scope.currentTemplateList
  //Try to limit write on the localBD by checking the state of the current row
  //TODO: May be better performance-wise to just drop the whole table instead
  $scope.updateTplListToDB=function(){
      var i;
      var j;
      var currentListLength=$scope.currentTemplateList.length;
      var DBListlength;
      var tplListDB=[];
      
      //Load the template list from the localDB
      $scope.localDB.transaction(function(tx) {
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
      });
      
      //Compare the current template list with the one store in the database and
      //update or create rows accordingly
      for(i=0;i<listLength;i++){
        for(j=0;j<currentTplListLenght;j++){
        
          if($scope.currentTemplateList[index].pk=tplListDB[j].pk){
            updateTemplate(pk);
          }
          else{
            createTemplate(pk);
          }
        }
      }
  };

  //refreshed the main list using data fetched from the server
  $scope.refreshTplList=function(){
    //Clear the previous list
    $scope.currentTemplateList=[];
    
    var i;
    var listLength=templateAlive.length;
    
    for(i=0;i<listLength;i++){
      $scopeCurrentList.push($scope.fetchedFullTemplateList[i]);
    }
  };
  
  //API call to get alive template list 
  $scope.fetchTemplateList=function(full){
    //Get list of full template from server
    if(full){
      $http.get("https://"+remoteService.getRemote()+"/template/?alive=true&json=true",{withCredentials :"true"}).then(function(resp) {
        console.log('Success', resp);
        $scope.fetchedFullTemplateList=resp.data;
      });
    }
    //Get list of template from server
    else{
      $http.get("http://"+remoteService.getRemote()+"/template/?alive=true",{withCredentials :"true"}).then(function(resp) {
        console.log('Success', resp);
        $scope.fetchedTemplateList=resp.data;
      });
    }
  };

  //API : Fetch a specific template 
  $scope.fetchTemplate=function(templateID){
    $http.get("http://"+remoteService.getRemote()+"/template/"+templateID,{withCredentials :"true"}).then(function(resp) {
      console.log('Success', resp);
      $scope.fetchedTemplateJSON=resp.data;
      }
      ,function(err) {
        console.error('ERR', err);
      })
  };

})

.controller('LoginCtrl', function($scope, $http, $state ,AuthenticationService,remoteService,$ionicSideMenuDelegate) {
  $scope.message = "";
  
  $scope.user = {
    username: "test",
    password: "test",
    server: "nodesk.sharedmemory.fr:8080"
  };

  $ionicSideMenuDelegate.canDragContent(false);
  
  $scope.login = function() {
    remoteService.setRemote($scope.user.server);
    AuthenticationService.login($scope.user);
  };
 
  
 $scope.login();

  $scope.$on('event:auth-loginRequired', function(e, rejection) {
    //alert("Error 401")
    //$scope.loginModal.show();
  });
 
  $scope.$on('event:auth-loginConfirmed', function() {
     $scope.username = null;
     $scope.password = null;
     $state.go('home', {}, {reload: true, inherit: false});
  });
  
  $scope.$on('event:auth-login-failed', function(e, status) {
    var error = "Login failed.";
    if (status == 401) {
      error = "Invalid Username or Password.";
    }
    $scope.message = error;
  });
 
  $scope.$on('event:auth-logout-complete', function() {
    $state.go('login', {}, {reload: true, inherit: false});
  }); 
  
})

.controller('DossierSyncCtrl', function($scope, $http, $state ,remoteService,authenticationService) {

  $scope.getFile=function(dossierID){
    $http.get("http://"+remoteService.getRemote()+"/"+dossierID).then(function(resp) {
      console.log('Success', resp);
      // For JSON responses, resp.data contains the result
    }, function(err) {
      console.error('ERR', err);
      // err.status will contain the status code
    })
  };
  
  $scope.saveFile=function(){
    var currentDate = new Date();
    var dateTime = currentDate.getTime(); 

    if($scope.isNew){
      $scope.localDB.transaction(function(tx) {
        tx.executeSql("INSERT INTO dossier (dossierJSON, timestamp) VALUES (?,?)", [$scope.currentTemplate,dateTime]);
      })
    }
    else{
      $scope.localDB.transaction(function(tx) {
        tx.executeSql("UPDATE dossier SET dossierJSON=?, timestamp=? WHERE idDossier=?", [$scope.currentTemplate,dateTime,$scope.currentID]);
      })
    }
  };

  $scope.sendFile=function(templateID){
    if ($scope.checkCompleteness($scope.currentTemplate).bool) {
      $http.post("http://"+remoteService.getRemote()+"/"+templateID,$scope.currentTemplate).then(function(resp) {
        console.log('Success', resp);
        // For JSON responses, resp.data contains the result
      }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
        // TODO:show a popup saying that there was an error (network, refused, etc
        // ...)
      })
    }
    else{
      //show popup with error error 
    }
  };
  
 
})
