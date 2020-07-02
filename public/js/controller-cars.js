/*global app*/
'use strict';

app.controller('CarsCtrl', ['$scope', 'SocketService', '$http', '$rootScope', '$location', function ($scope, SocketService, $http, $rootScope, $location) {

    $scope.companies = ['General Motors', 'Volkswagem', 'Ford'];
    $scope.cars = [];
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
    
        $http.get('/api/cars').then((res) => {
            $scope.cars = res.data;
        });
    
        SocketService.emit('openChannel', {
            roomId: "cars",
            nickname: $rootScope.nickname
        });

    }

    $scope.add = function () {
        let form = angular.copy($scope.form);

        $scope.invalidInput = false;

        SocketService.emit('registerItem', {
            roomId: 'cars',
            data: form
        });
    }

    SocketService.on('newUser', function (items) {
        $scope.usersOnline = items;
    });

    SocketService.on('newItem', function (item) {
        $scope.cars.push(item.data)
    });

    SocketService.on('error:registerItem', function (error) {
        $scope.invalidInput = true;
    });

    SocketService.on('success:registerItem', function (item) {
        $scope.cars.push(item.data);
    });

    $scope.$on('$locationChangeStart', function (event, next, current) {
        SocketService.disconnect();
    });

    init();

}]);