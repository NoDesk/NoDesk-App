angular.module('starter.controllers', ['ui.bootstrap'])

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
  /*
  $scope.myInterval = 5000;  
  var slides = $scope.slides = []; 
  
  $scope.addSlide = function() {
    var newWidth = 500 + slides.length;
    slides.push({
      image: 'http://placekitten.com/' + newWidth + '/250',
      text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
    });
  };

  for (var i=0; i<4; i++) {
    $scope.addSlide();
  }
  
  */

  
})

.controller('BrowseCtrl', function($scope) {
  $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'And another choice for you2.',
    'but wait! A third!'
  ];
  
})


/*Examples of controller
.controller('ToDoListCtrl', function($scope,$ionicModal) {
	$scope.toDoListItems = [{
    task: 'Scuba Diving',
    status: 'not done'
  }, {
    task: 'Climb Everest',
    status: 'not done'
  }];

$scope.AddItem = function(data){
	$scope.toDoListItems.push({task:data.newItem,status:'not done'});
	 data.newItem = ' ';
         $scope.closeModal();
  };
  
$ionicModal.fromTemplateUrl('modal.html', {
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

});
*/

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

