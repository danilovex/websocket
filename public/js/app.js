var app = angular.module('simplePage', ['ngRoute', 'ngAnimate', 'toastr']);
//'btford.socket-io'
// app.service('SocketService', ['socketFactory', function SocketService(socketFactory) {
//    return socketFactory();
// }]);

app.factory('SocketService', function ($rootScope, $location) {

   var safeApply = function(scope, fn) {
      if (scope.$$phase) {
        fn(); // digest already in progress, just run the function
      } else {
        scope.$apply(fn); // no digest in progress, run with $apply
      }
    };

    let baseUrl = $location.$$absUrl
    .toString()
    .substring(0, decodeURIComponent($location.$$absUrl)
    .toString()
    .indexOf($location.$$path.toString(), $location.$$absUrl.toString()
    .indexOf('#')) + 1);

    var token = 'clientID123456789';

    var socket = io.connect(baseUrl, {
      //path: `/api/backend/socket.io`,
      origins: '*:*',
      // transports: ['polling'],
      transportOptions: {
        polling: {
           extraHeaders: {
              'authorization': token
           }
        }
       }
    });

    socket.on('error', function (reason){
       console.log(reason)
      socket.disconnect();
      console.error('Unable to connect Socket.IO', reason);
    });

    socket.on('connect', function (){
      console.info('successfully established a working and authorized connection');
    });

    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {  
          var args = arguments;
          safeApply($rootScope, function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          safeApply($rootScope, function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      },
      disconnect: function () {
        socket.disconnect();
      },
      socket: socket
    }; 
   
});

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
{
   // remove o # da url
   //$locationProvider.html5Mode(true);

   $routeProvider

   // para a rota '/', carregaremos o template home.html e o controller 'HomeCtrl'
   .when('/', {
      templateUrl : 'pages/index.html',
      controller     : 'IndexCtrl',
   })
   .when('/cars', {
      templateUrl : 'pages/cars.html',
      controller     : 'CarsCtrl',
   })
   .when('/foods', {
      templateUrl : 'pages/foods.html',
      controller     : 'FoodsCtrl',
   })

   // para a rota '/sobre', carregaremos o template sobre.html e o controller 'SobreCtrl'
   /*
   .when('/sobre', {
      templateUrl : 'app/views/sobre.html',
      controller  : 'SobreCtrl',
   })
   */
   // caso não seja nenhum desses, redirecione para a rota '/'
   .otherwise ({ redirectTo: '/' });
}]);