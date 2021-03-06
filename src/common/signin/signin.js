import pagetemplate from './signin.html';
import directivetemplate from './signin-directive.html';

let SigninModule = angular.module('signin', [])

/* @ngInject */
  .config(
    function ($stateProvider, $urlRouterProvider, accessLevels) {
      $stateProvider
        .state('signin', {
          url: '/signin',
          template: pagetemplate,
          controller: 'SigninController as vm',
          access: accessLevels.all,
          resolve: {}
        });

    })
  /* @ngInject */
  .controller('SigninController',
    function ($scope, $rootScope, $state, $stateParams, UserService) {

    }
  )
  /* @ngInject */
  .directive('signIn', function (UserService, $rootScope, $state) {
    return {
      restrict: 'E',
      scope: {
        onSignIn: '&?'
      },
      template: directivetemplate,
      link: function (scope, elem, attrs) {
        scope.keepMeLoggedIn = true;
        scope.submit = function () {
          UserService.login(UserService.encodeCredentials(scope.username, scope.password), scope.keepMeLoggedIn)
            .then(function (response) {
              scope.username = '';
              scope.password = '';

              if (attrs.onSignIn) { // can't check isolated scope variable as it is always defined
                return scope.onSignIn();
              }

              if ($rootScope.nextStateAfterLogin) {
                $state.go($rootScope.nextStateAfterLogin.toState, $rootScope.nextStateAfterLogin.toParams);
              } else {
                $state.go('home');
              }
            });
        };
      }
    };
  });


export default SigninModule;
