/*
 * TODO: Remove all console.log when releasing 
 * */


angular.module('starter.controllers', ['ui.bootstrap','textAngular','ngCookies'])

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

.controller('BrowseCtrl', function($scope,TemplateSyncService,DossierSyncService,$q) {
  $scope.items=[];
  $scope.template=[];
  
  var def = TemplateSyncService.fetchTemplateList(false);
  def.then(function(result){$scope.template=result.data;console.log($scope.template);$scope.getAllDossier();});
  var allDossierID=[]
  var allDossierFull=[];

  $scope.getAllDossier=function(){
    allDossierID=[];
    allDossierFull=[];
    console.log("length"+$scope.template.length);

    for (var i = 0; i < $scope.template.length; i++) {
      allDossierID.push(DossierSyncService.getAllDossierFromTemplate($scope.template[i].pk));
    };
    
    $q.all(allDossierID).then(function(ret){
      console.log(ret);
      for (var i = 0; i < ret.length; i++) {
        for (var j = 0; j < ret[i].length; j++) {
          allDossierFull.push(DossierSyncService.getFile(ret[i][j].pk,i+1));
          console.log(ret[i][j].pk);
        };
      };      
      $q.all(allDossierFull).then(function(ret2){
        allDossierFull=[];
        var k=0;

        for (var i = 0; i < ret.length; i++) {
          allDossierFull.push([]);
          for (var j = 0; j < ret[i].length; j++) {
            allDossierFull[i][j]=ret2[k];
            k++;
          };
        };
        console.log(allDossierFull);
        $scope.showDossier();
      })
    })
  };
  
  
  $scope.showDossier=function(){
    var col,row=-1;
    
    for (var i = 0; i < $scope.template.length; i++) {
      var tmp={}
      tmp.dossier=[];
      tmp.template=$scope.template[i].name;
      
      row=-1;
      
      for (col = 0; col < allDossierFull[i].length; col++) {
        
        if(col%4==0){
          tmp.dossier.push([]);
          row++;
        }

        tmp.dossier[row].push(allDossierFull[i][col]);
        console.log(allDossierFull[i][col]);
      };
      
      $scope.items.push(tmp);

    };
    console.log($scope.items);
  };
  
  
  /*
  $scope.items = [[
    'The first choice!',
    'And another choice for you.',
    'And another choice for you2.',
    'but wait! A third!'
  ],
  ['hurr','durr','toto','test']];
  */

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

.controller('ChoiceCtrl', function($scope,TemplateSyncService) {
  $scope.TemplateList=TemplateSyncService.getTemplateList();
  $scope.select=function(item){
    TemplateSyncService.setChoice(item);
  };
})

.controller('ErrorFormCtrl', function($scope,ErrorFormService) {
  $scope.errors=ErrorFormService.getError();
})

.controller('SaveCtrl', function($scope,TemplateSyncService,DossierSyncService,remoteService,databaseService,ErrorFormService) {
  
   
})

.controller('EditorCtrl', function($scope,$sce,$state,$ionicPopup, $timeout,$ionicModal,$cookies,$http,inputForm,TemplateSyncService,DossierSyncService,ErrorFormService) {
  $scope.currentTemplate=[];
  $scope.currentTemplateList=[];
  $scope.toParse;
        

       // console.log($cookieStore.get('session'));
       // console.log($cookieStore.get('sessionid'));
       // console.log($cookieStore.get('csrftoken'));
  console.log($cookies.sessionid);
  console.log($cookies.csrftoken);
  console.log(document.cookie);
  
  $http.defaults.headers.post['X-CSRFToken']=$cookies['csrftoken'];
  console.log($cookies['csrftoken']);
  
  var def = TemplateSyncService.fetchTemplateList(true);
  def.then(function(result){$scope.currentTemplateList=result;$scope.showTemplateChoice();});

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
  
  $scope.showTemplateChoice=function(){
    var myPopup = $ionicPopup.confirm({
      title: 'Choissisez un template',
      scope: $scope,
      template:'<ion-list ng-controller="ChoiceCtrl"> <ion-item ng-repeat="item in TemplateList" ng-click="select(item)"> {{item.name}}! </ion-item> </ion-list>'
      
    });
    myPopup.then(function(res){
      if(res){
        $scope.toParse=TemplateSyncService.getChoice().json;
        console.log($scope.toParse);
        $scope.parseTemplate();
      }
      else
        $state.go('home');
    });
  };

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

    var base64;

    document.querySelector(".view").style.overflow = "visible";
    document.querySelector(".has-header.scroll-content.ionic-scroll.has-subheader").style.overflow = "visible";
    document.querySelector(".menu-content.pane.disable-user-behavior").style.overflow = "visible";
    //scroll.removeAttribute("style");
    html2canvas(document.querySelector("#currentFile"), {
      allowTaint:'true',
      useOverflow:'false',
      onrendered: function(canvas) {

        var base64 = canvas.toDataURL();
        document.querySelector(".view").style.overflow = "hidden";
        document.querySelector(".has-header.scroll-content.ionic-scroll.has-subheader").style.overflow = "hidden";
        document.querySelector(".menu-content.pane.disable-user-behavior").style.overflow = "hidden";
    
      }
    });
    return base64;
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
            $scope.getVideo(refValue);
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
  

  $scope.osmURL=function(coord){
        var gps1=(coord.split(",")[1]-0.1); 
        var gps2=(coord.split(",")[0]-0.1 ); 
        var gps3=(coord.split(",")[1]+0.1); 
        var gps4=(coord.split(",")[0]+0.1);
        var baseURL="http://www.openstreetmap.org/export/embed.html?bbox=" +gps1+'%2C'+gps2+'%2C'+gps3+'%2C'+gps4+'&amp;layer=mapnik'; 
    
    return $sce.trustAsResourceUrl(baseURL);
  };

  $scope.parseTemplate=function(){
    var tmp=[];
    var parsed=JSON.parse($scope.toParse);
    
    for (var i = 0; i < parsed.length; i++) {
      var tmpItem={type:"",name:"",value:""};
      tmpItem.type=parsed[i].type;
      tmpItem.name=parsed[i].name;
      tmpItem.value=parsed[i].value;
      
      if(tmpItem.type=="Image")
        tmpItem.value="img/image.svg"
      else if(tmpItem.type=="RadioBox")
        tmpItem.result='';
      else if(tmpItem.type=="Checkbox"){
        for (var j = 0; j < tmpItem.value.length; j++) {
          var tmp2={};
          tmp2.text=tmpItem.value[j];
          tmp2.checked=false;
          tmpItem.value[j]=tmp2;
        };
      }
      tmp.push(tmpItem);
    };

    $scope.currentTemplate=tmp;
    console.log($scope.currentTemplate);
  };
  
  $scope.showError=function(refValue){
    var myPopup = $ionicPopup.show({
    title: 'Champs non complétés',
    templateURL:'template/errorForm.html',
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
  };

  $scope.saveAndsend=function(){
    //save to localDB
    var result=DossierSyncService.checkCompleteness($scope.currentTemplate);
    var thumbnail=$scope.storeCanvas();
    console.log(thumbnail); 
    if(result.bool){
      DossierSyncService.sendFile(TemplateSyncService.getChoice().pk,$scope.currentTemplate,$scope.toParse);
    }
    else{
      ErrorFormService.setError(result.where);
      $scope.showError();
    }

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

