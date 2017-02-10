import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import angular from 'angular';
import angulardech from 'angular-i18n/angular-locale_de-ch';
import angularde from 'angular-i18n/angular-locale_de';
import uiRouter from 'angular-ui-router';
import ngTranslate from 'angular-translate';
import dynamicLocale from 'angular-dynamic-locale';
import restangular from 'restangular';
import localStorage from 'angular-local-storage';
import AppComponent from './app.component.js';
import Common from './common/common';
import Components from './components/components';
import './styles.scss';
import moment from 'moment';

angular.module('myApp', [
  uiRouter,
  Common.name,
  Components.name,
  ngTranslate,
  dynamicLocale,
  restangular,
  localStorage
])
  .directive('app', AppComponent);


function _reportErrorToBackend(exception, cause, $injector) {
  var Restangular = $injector.get('Restangular');
  var $window = $injector.get('$window');
  var UserService = $injector.get('UserService');
  var $rootScope = $injector.get('$rootScope');

  var data = {
    message: exception.message,
    cause: JSON.stringify(cause),
    version: $rootScope.appVersion,
    location: $window.location.href,
    userAgent: navigator.userAgent,
    stack: exception.stack,
    username: UserService.principal.getUser().username,
    profileLocation: _.get(UserService.principal.getUser(), 'profile.homeAddress.location'),
    clientTime: new Date().toISOString(),
    clientLocale: moment.locale()
  };

  //Restangular.all('/error').post(data);
}

/* @ngInject */
angular.module('myApp')
  .config(function ($stateProvider, $urlRouterProvider, $translateProvider, RestangularProvider,
                    tmhDynamicLocaleProvider, $provide, $httpProvider) {
    $translateProvider.useSanitizeValueStrategy(null);

    $translateProvider.translations('de', {
      passwordResetRequest: {
        resetPasswordFor: 'Passwort zurücksetzen für SyBa',
        identification: '',
        usernameOrEmail: 'Username oder Email',
        submit: 'Senden',
        checkYourEmails: 'überprüfe deine Emails',
        weSentALink: 'Wir haben einen Link versendet mit dem das Passwort geändert werden kann',
        back: 'zurück',
        emailDoesNotExist: 'Kein Benutzerkonto gefunden mit diesem  Usernamen oder Email'
      },
      signup: {
        header: 'Anmeldung'
      },
      loginform: {
        usernameOrEmail: {
          label: 'Username oder Email'
        },
        password: {
          label: 'Passwort'
        },
        login: 'senden',
        passwordForgotten: 'Passwort vergessen'
      }
    });

    $translateProvider.translations('en', {
      passwordResetRequest: {
        resetPasswordFor: 'Reset Password for SyBa',
        identification: 'Identification',
        usernameOrEmail: 'Username or Email',
        submit: 'submit',
        checkYourEmails: 'check your emails',
        weSentALink: 'We sent you a link to reset your password',
        back: 'zurück',
        emailDoesNotExist: 'No User found with this email or username'
      }

    });

    $translateProvider.preferredLanguage('de');
    $translateProvider.fallbackLanguage('de');

    // TODO: add in env speciic config
    //  RestangularProvider.setBaseUrl(config && config.backendUrl);
    // for now we use local dev server
    RestangularProvider.setBaseUrl('http://localhost:8080/api');

    // if state is unknown go to /home

    $urlRouterProvider.otherwise(function ($injector) {
      var $state = $injector.get('$state');
      $state.go('home');
    });


    tmhDynamicLocaleProvider.localeLocationPattern('./angular-locale_{{locale}}.js');

    // use: throw { message: 'error message' };
    $provide.decorator('$exceptionHandler', ['$delegate', '$injector', function ($delegate, $injector) {
      return function (exception, cause) {
        // $delegate(exception, cause);
        $injector.get('$log').log("Exception: " + exception);
        $injector.get('$log').log("Cause: " + cause);
        _reportErrorToBackend(exception, cause, $injector);
      };
    }]);

    $httpProvider.interceptors.push(['$q', '$rootScope', '$log',
      function ($q, $rootScope, $log) {
        return {
          'responseError': function (rejection) {
            // do something on error

            // it seems we always get "status === 0" for the error case "no internet connection
            $log.log('$http Error: ' + rejection.status);
            if (rejection.status === 0) {
              $rootScope.$emit('NoInternetConnection');
            }
            return $q.reject(rejection);
          }
        };
      }]);
  })

  /* @ngInject */
  .run(
    function ($rootScope, UserService, $filter, $state, $stateParams, $injector, $log,
              $timeout, $translate, tmhDynamicLocale, tmhDynamicLocaleCache) {

      // preload the most importand dynamic locales

      function getInjectedLocale() {
        var localInjector = angular.injector(['ngLocale']);
        return localInjector.get('$locale');
      }

      // put de-de language into cache
      tmhDynamicLocaleCache.put('de-ch', getInjectedLocale());
      tmhDynamicLocaleCache.put('de', getInjectedLocale());


      if (typeof navigator.globalization !== 'undefined') {
        navigator.globalization.getPreferredLanguage(_setLanguage, null);
      } else if (navigator.language || navigator.userLanguage) {
        _setLanguage(navigator.language || navigator.userLanguage);
      }

      function _setLanguage(language) {

        var locale = (language.value || language).toLowerCase();

        $log.log('detected system language, setting language to: ' + locale);

        // setting the locale on moment, so we get localized dates and times
        moment.locale(locale);
        $log.log('set moment.js locale to: ' + locale);

        tmhDynamicLocale.set(locale.toLowerCase())
          .then(function (localeSet) {
            return localeSet;
          }, function (err) {
            $log.log('ERROR setting angular internal locale: ' + locale + ', ' + JSON.stringify(err));
            if (locale.split('-').length > 1) {
              $log.log('trying short locale: ' + locale.split('-')[0]);
              return tmhDynamicLocale.set(locale.split('-')[0]);
            } else {
              $log.log('ERROR setting angular internal locale: ' + JSON.stringify(err) + ', using default');
            }
          })
          .then(function (localeSet) {
            $log.log('set angular internal locale to: ' + localeSet.id);
          }, function (err) {
            $log.log('ERROR setting angular internal locale: ' + JSON.stringify(err) + ', using default');
          });


        $translate.use(locale.split('-')[0]).then(function (data) {
          $log.log('set angular-translate locale to: ' + data);
        }, function (error) {
          $log.log('ERROR detecting system language: ' + error);
        });
      }

      // put some general services on $rootScope
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;


      // handle routing authentication
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $log.log('stateChangeStart from: ' + (fromState && fromState.name) + ' to: ' + toState.name);

        toState.previous = fromState;

        var requiredAccessLevel = toState.access;

        if (UserService.initialized) {
          if (!UserService.principal.isAuthorized(requiredAccessLevel)) {
            event.preventDefault();

            if (!UserService.principal.isAuthenticated()) {
              $log.log('preventing state change because user is not authenticated, redirect to state: "signin"');
              $rootScope.nextStateAfterLogin = {toState: toState, toParams: toParams};
              $state.go('signin');
            } else {
              $log.log('preventing state change because user is not authorized for: ' + requiredAccessLevel + ', has roles: ' + UserService.principal.getUser().roles);
              $rootScope.$emit('clientmsg:error', 'user is not authorized for: ' + requiredAccessLevel + ', has roles: ' + UserService.principal.getUser().roles);
            }

          }
        } else {
          // if the UserService is not done initializing we cancel the stateChange and schedule it again a bit later
          event.preventDefault();
          var waitTime = 400;
          $log.log('preventing state change and waiting ' + waitTime + 'ms, Reason:  UserService initialized: ' + UserService.initialized + '"');
          $timeout(function () {
            $state.go(toState, toParams);
          }, waitTime);
        }
      });

      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $log.log('stateChangeSuccess from: ' + (fromState && fromState.name) + ' to: ' + toState.name);
      });

      // log stateChangeErrors
      $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        var msg = 'Error on StateChange from: "' + (fromState && fromState.name) + '" to:  "' + toState.name + '", err:' +
          error.message + ', code: ' + error.status;
        $log.log(msg);
        $log.log(JSON.stringify(error.stack));
        _reportErrorToBackend(error, msg, $injector);

        if (error.status === 401) { // Unauthorized

          $state.go('signin.content');

        } else if (error.status === 503) {
          // the backend is down for maintenance, we stay on the page
          // a message is shown to the user automatically by the error interceptor
          event.preventDefault();
        } else {

          $rootScope.$emit('clientmsg:error', error);
          $log.log('Stack: ' + error.stack);

          // check if we tried to go to a home state, then we cannot redirect again to the same
          // homestate, because that would lead to a loop
          if (toState.name === 'home') {
            event.preventDefault();
          } else {
            return $state.go('home');
          }
        }
      });
    })
;

