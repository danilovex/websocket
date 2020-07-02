/*global app*/
'use strict';

app.controller('FoodsCtrl', ['$scope', 'SocketService', '$http', '$rootScope', function ($scope, SocketService, $http, $rootScope) {

    $scope.foods = [];
    $scope.form = {};
    $scope.usersOnline = [];
    $scope.invalidInput = false;

    function init(){

        if(!$rootScope.nickname){
            $location.url('/#!/');
        }

        if (!SocketService.socket.connected) {
            SocketService.socket.connect();
        }

        $http.get('/api/foods').then((res) => {
            $scope.foods = res.data;
        });
    
        SocketService.emit('openChannel', {
            roomId: "foods",
            nickname: $rootScope.nickname
        });

    }

    $scope.add = function () {
        let form = angular.copy($scope.form);

        $scope.invalidInput = false;

        SocketService.emit('registerItem', {
            roomId: 'foods',
            data: form
        });
        
    }

    SocketService.on('newUser', function (items) {
        $scope.usersOnline = items;
    });

    SocketService.on('newItem', function (item) {    
        $scope.foods.push(item.data.food)
    });

    SocketService.on('error:registerItem', function(error) {
        $scope.invalidInput = true;
    });

    SocketService.on('success:registerItem', function(item) {
        $scope.foods.push(item.data.food);
    });

    $scope.$on('$locationChangeStart', function (event, next, current) {
        SocketService.disconnect();
    });

    init();


}]);