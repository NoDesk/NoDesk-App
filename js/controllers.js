angular.module('starter.controllers', ['ui.bootstrap','textAngular'])

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

.controller('EditorCtrl', function($scope,$state,$ionicPopup, $timeout) {
  $scope.currentTemplate;
  
  $scope.goTo= function(e){
    $state.go(e);
    console.log(e);
  };
  
  $scope.test=function(){
  }
  
  $scope.addImage=function(refValue){
    var myPopup = $ionicPopup.show({
    template: '<input type="password" ng-model="data.wifi">',
    title: 'Enter Wi-Fi Password',
    subTitle: 'Please use normal things',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.wifi) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.wifi;
          }
        }
      },
    ]
    });
    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });
    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
  };

  $scope.addSound=function(refValue){
  }

  $scope.addVideo=function(refValue){
  }

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
