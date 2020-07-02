/*global app*/
'use strict';

app.controller('IndexCtrl', ['$scope', '$rootScope', '$location', 'toastr', function($scope, $rootScope, $location, toastr)
{

   $scope.form = {};
   $scope.showMenu = false;

   if($rootScope.nickname){
      $scope.showMenu = true;
   }

   $scope.sigin = function(){
      $rootScope['nickname'] = $scope.form.nickname;
      $scope.showMenu = true;
   };

}]);