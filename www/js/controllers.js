angular.module('starter.controllers', [])


.controller('bagdeCount',function($scope,$localstorage,$rootScope) {
  var favorieten = JSON.parse($localstorage.get('favorieten'));
  $scope.data = {
    badgeCount : $rootScope.aantalfav
  };

})
.controller('informatieCtrl', function($scope, $http,$rootScope,$cordovaGeolocation,$ImageCacheFactory) {

})
.controller('homeCtrl', function($scope, $http,$rootScope,$cordovaGeolocation,$ImageCacheFactory) {


        $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: false}).then(function (position) {
          var lat  = position.coords.latitude
          var long = position.coords.longitude
          $rootScope.lng = long;
          $rootScope.lat = lat;
        });

        $http.get('http://waterwegwerkt.nl/controllers/api_deelnemers').then(function(res){

          var deelnemers = res.data;
          var images = [];
          for(var i=0; i<deelnemers.length;i++){
			        images.push('http://www.waterwegwerkt.nl' + deelnemers[i].img);
              images.push('http://www.waterwegwerkt.nl' + deelnemers[i].img_header);
		        }
            $ImageCacheFactory.Cache(images);
        });

})

.controller('bedrijfCtrl', function($state,$scope,$http,$localstorage) {

  var id = $localstorage.get('login');

  $scope.bedrijfsnaam = $localstorage.get('bedrijfsnaam');

  $scope.uitloggen = function(){

    $localstorage.removeItem('login');
    $state.go("tab.login");
  }


})


.controller('loginCtrl', function($scope,$http,$localstorage,$state) {

  var id = $localstorage.get('login');

  if (id > 0){
    $state.go("tab.bedrijf");
  }

  $scope.inloggen = function(data){


    var link = 'http://www.waterwegwerkt.nl/controllers/api_wachtwoord';

      $http.post(link, {wachtwoord : data.wachtwoord}).then(function (res){
            var status = res.data.login.status;

            if (status === "success"){

              $scope.error = '';
              data.wachtwoord = '';
              $localstorage.set('login',res.data.login.id);
              $localstorage.set('bedrijfsnaam',res.data.login.naam);

              $state.go("tab.bedrijf");

            }else{

              $scope.error = 'error';
            }
      });
   };


})


.controller('deelnemersCtrl', function($scope, Chats,$http) {
  $http.get('http://waterwegwerkt.nl/controllers/api_deelnemers').then(function(res){
    $scope.deelnemers = res.data;
  });
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    removeItem: function(key) {
      $window.localStorage.removeItem(key);
    }
  }
}])

.filter('trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}])


.controller('deelnemerCtrl', function($scope,$rootScope, $stateParams, Chats, $http,$localstorage,$cordovaGeolocation) {
  var Lat;
  var Lng;

  $http.get('http://waterwegwerkt.nl/controllers/api_deelnemer/' + $stateParams.deelnemerId).then(function(res){
    $scope.deelnemer = res.data;
    Lat = res.data.lat;
    Lng = res.data.lng;
  });


    $scope.Bepaalroute = function(){
      launchnavigator.navigate(
        [Lat, Lng],
        null,
        function(){
          //  alert("Plugin success");
        },
        function(error){
          //  alert("Plugin error: "+ error);
        });

    };

    if ($localstorage.get('favorieten','nietgezet') == 'nietgezet'){
      var favorieten = [];
    }else{
      var favorieten = JSON.parse($localstorage.get('favorieten'));


      if (favorieten.indexOf(Number($stateParams.deelnemerId)) > -1 ){

        $scope.isActive = true;
        $scope.isnotActive = false;

      }else{
        $scope.isActive = false;
        $scope.isnotActive = true;

      }
    }


      $scope.fav = function () {


          if ($scope.isActive == true){
            $scope.isActive = false;
            $scope.isnotActive = true;

            var index = favorieten.indexOf(Number($stateParams.deelnemerId));
            if (index > -1) {
                favorieten.splice(index, 1);
              }
          }else{

            $scope.isActive = true;
            $scope.isnotActive = false;

            favorieten.push(Number($stateParams.deelnemerId));
          }

          $localstorage.set("favorieten",JSON.stringify(favorieten));
          $rootScope.aantalfav = favorieten.length;


       };
})

.controller('favorietenCtrl', function($rootScope,$scope,$cordovaGeolocation,$http,$localstorage,$ionicScrollDelegate) {
  if ($localstorage.get('favorieten','nietgezet') == 'nietgezet'){
    var favorieten = [];
    $localstorage.set("favorieten",JSON.stringify(favorieten));
    $scope.doRefresh();
 }

$scope.test = function() {
   $ionicScrollDelegate.scrollTop(0,0,true);
  var favorieten = [];
  favorieten.push(54);
  $localstorage.set("favorieten",JSON.stringify(favorieten));
  $scope.doRefresh();
};





  $scope.doRefresh = function() {
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {

        var lat  = position.coords.latitude
        var long = position.coords.longitude

        if ($localstorage.get('favorieten','nietgezet') != 'nietgezet'){

            var link = 'http://www.waterwegwerkt.nl/controllers/api_fav';
            $http.post(link, {lng: long, lat: lat, fav : $localstorage.get('favorieten')}).then(function (res){
            $scope.favorieten = res.data;
            });
        }

      }, function(err) {
        // error
      });
         $scope.$broadcast('scroll.refreshComplete');
    };



  $scope.$on("$ionicView.enter", function () {


      if ($localstorage.get('favorieten','nietgezet') != 'nietgezet'){

          var link = 'http://www.waterwegwerkt.nl/controllers/api_fav';
          $http.post(link, {lng: $rootScope.lng, lat: $rootScope.lat, fav : $localstorage.get('favorieten')}).then(function (res){

            $scope.favorieten = res.data;
          });

      }


     });

})


.controller('timelineCtrl', function($scope,$http,$localstorage, $ionicScrollDelegate) {

  $scope.doRefresh = function() {
    $http.get('http://waterwegwerkt.nl/controllers/api_save')
       .success(function(res) {

        $scope.berichten = res;
       })
       .finally(function() {
         // Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
       });
         $ionicScrollDelegate.scrollBottom(0,0,true);
    };



  $http.get('http://waterwegwerkt.nl/controllers/api_save').then(function(res){
    $scope.berichten = res.data;
      $ionicScrollDelegate.scrollBottom(0,0,true);
  });

  $scope.submit = function(data){

        var link = 'http://www.waterwegwerkt.nl/controllers/api_save';
        $http.post(link, {username : data.username, id: $localstorage.get('login')}).then(function (res){
          $scope.berichten = res.data;
          $scope.data.username = '';
          $ionicScrollDelegate.scrollBottom(0,0,true);
       });
   };

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
