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

//Examples of controller
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
