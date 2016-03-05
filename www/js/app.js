// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core','ionic.service.analytics', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function ($rootScope,  $localstorage) {
        $rootScope.lat = 0;
        $rootScope.lng = 0;
        var favorieten = [];
        $localstorage.set("favorieten",JSON.stringify(favorieten));
})
.run(function($ionicPlatform, $ionicAnalytics) {
  $ionicPlatform.ready(function() {


    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }



  });
})

.config(function($stateProvider, $urlRouterProvider,  $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })


  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('tab.deelnemers', {
      url: '/deelnemers',
      views: {
        'tab-deelnemers': {
          templateUrl: 'templates/deelnemers.html',
          controller: 'deelnemersCtrl'
        }
      }
    })
    .state('tab.deelnemer', {
      url: '/deelnemer/:deelnemerId',
      views: {
        'tab-deelnemers': {
          templateUrl: 'templates/deelnemer.html',
          controller: 'deelnemerCtrl'
        }
      }
    })

    .state('tab.favorieten', {
        url: '/favorieten',
        views: {
          'tab-favorieten': {
            templateUrl: 'templates/favorieten.html',
            controller:   'favorietenCtrl',
            controllerAs: 'favorietenCtrl'
          }
        }
      })

    .state('tab.favoriet', {
      url: '/favoriet/:deelnemerId',
      views: {
        'tab-favorieten': {
          templateUrl: 'templates/deelnemer.html',
          controller: 'deelnemerCtrl'
        }
      }
    })

    .state('tab.vacatures', {
          url: '/vacatures',
          views: {
            'tab-vacatures': {
              templateUrl: 'templates/vacatures.html',
              controller: 'vacaturesCtrl'
            }
          }
        })
    .state('tab.informatie', {
      url: '/informatie',
      views: {
        'tab-informatie': {
          templateUrl: 'templates/informatie.html',
          controller: 'informatieCtrl'
        }
      }
    })

    .state('tab.timeline', {
        url: '/timeline',
        views: {
          'tab-timeline': {
            templateUrl: 'templates/timeline.html',
            controller: 'timelineCtrl'
          }
        }
      })


  .state('tab.login', {
        url: '/login',
        views: {
          'tab-home': {
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
          }
        }
      })


      .state('tab.bedrijf', {
            url: '/bedrijf',
            views: {
              'tab-home': {
                templateUrl: 'templates/bedrijf.html',
                controller: 'bedrijfCtrl'
              }
            }
          });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
