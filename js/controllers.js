angular.module('starter.controllers', ['ui.bootstrap','textAngular'])

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
  $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'And another choice for you2.',
    'but wait! A third!'
  ];
  
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

.controller('MainButtonCtrl', function($scope,$location,$state) {
  
  $scope.goTo= function(e){
    $state.go(e);
    console.log(e);
  };

})

.controller('EditorCtrl', function($scope,$state,$ionicPopup, $timeout,$ionicModal,$http) {
  $scope.currentTemplate;
  
  /*Cordova/phonegap */ 
  
  /*Camera - Get Picture
   * API links : https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md
   **/
  /*
  navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
    destinationType: Camera.DestinationType.DATA_URL
  });

  function onSuccess(imageData) {
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageData;
  }

  function onFail(message) {
    alert('Failed because: ' + message);
  } 
  */

  /*GPS - Get Position
   * API links : https://github.com/apache/cordova-plugin-geolocation/blob/master/doc/index.md
   **/
  /*
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
  };

  // onError Callback receives a PositionError object
  //
  function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
  }

  navigator.geolocation.getCurrentPosition(onSuccess, onError);
  */

  /*Audio - Get/Play audio media
   * API links : https://github.com/apache/cordova-plugin-media/blob/master/doc/index.md  
   **/
   
  /*
  // Record audio
  //
  function recordAudio() {
    var src = "myrecording.mp3";
    var mediaRec = new Media(src,
      // success callback
      function() {
        console.log("recordAudio():Audio Success");
      },
      // error callback
      function(err) {
        console.log("recordAudio():Audio Error: "+ err.code);
      });

      // Record audio
      mediaRec.startRecord();
  }
  
  //Stop recording   
  mediaRec.stopRecord();
  /*
  /*EMD -- Cordova/phonegap */

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
        onTap: function(refValue) {
            //Cordova/phoneGap Files explorer
            //MIME-type image 
            return ;
        }
      },
      { type: 'button button-icon icon ion-camera',
        onTap: function(refValue) {
            //Cordova/phoneGap camera 
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

  $scope.addSound=function(refValue){
    var myPopup2 = $ionicPopup.show({
    title: 'Selectionner fichier audio', 
    template: '<input type="file" id="fileInput">', // String (optional). The html template to place in the popup body.
    scope: $scope,
    buttons: [
      { type: 'button button-icon icon ion-folder',
        onTap: function(refValue) {
            //Cordova/phoneGap Files explorer
            //MIME-type audio 
            return;
        }
      },
      { type: 'button button-icon icon ion-ios7-mic',
        onTap: function(refValue) {
            //Cordova/phoneGap microphone
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
   
  
  /*FIX-ME: Doesn't render overflown centent*/
  $scope.storeCanvas=function(){
    html2canvas(document.querySelector("#currentFile"), {
      allowTaint:'true',
      useOverflow:'true',
      onrendered: function(canvas) {

        var base64 = canvas.toDataURL();
        console.log(base64);
    }
    });
  };


  $scope.addVideo=function(refValue){
    var myPopup3 = $ionicPopup.show({
    title: 'Selectionner video',
    scope: $scope,
    buttons: [
      { type: 'button button-icon icon ion-folder',
        onTap: function(refValue) {
            //Cordova/phoneGap Files explorer
            //MIME-type video 
            return;
        }
      },
      { type: 'button button-icon icon ion-videocamera',
        onTap: function(refValue) {
            //Cordova/phoneGap camera/video
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
        onTap: function(refValue) {
            //Cordova/phoneGap gps
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

  
  $scope.fetchTemplateList=function(server){
    $http.get(server+"/template/").then(function(resp) {
      console.log('Success', resp);
      }
      ,function(err) {
        console.error('ERR', err);
      })
  };
  
  $scope.getFile=function(server,dossierID){
    $http.get(server+''+dossierID).then(function(resp) {
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

  $scope.sendFile=function(server){
    $http.post(server).then(function(resp) {
      console.log('Success', resp);
      // For JSON responses, resp.data contains the result
    }, function(err) {
      console.error('ERR', err);
      // err.status will contain the status code
    })
  };

  $scope.parseTemplate=function(/*templateJSON*/){
    //var tpl=JSON.parse(templateJSON)
    
    var tpl=[ { type: 'TextArea', name: 'TextArea_', value: 'TextArea' },
    { type: 'TextLine', name: 'TextLine_', value: 'TextLine' },
    { type: 'Image', name: 'Image_', value: 'template_test.yaml' },
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


.controller('PINModalCtrl', function($scope,$ionicModal) {
  $ionicModal.fromTemplateUrl('PIN',function(modal){
      $scope.loginModal=modal;
    },
    {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
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


.controller('LoginCtrl', function($scope, $http, $state ,AuthenticationService) {
  $scope.message = "";
  
  $scope.user = {
    username: null,
    password: null
  };
 
  $scope.login = function() {
    AuthenticationService.login($scope.user);
  };
 
  
  $scope.$on('event:auth-loginRequired', function(e, rejection) {
    $scope.loginModal.show();
  });
 
  $scope.$on('event:auth-loginConfirmed', function() {
     $scope.username = null;
     $scope.password = null;
     $scope.loginModal.hide();
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


