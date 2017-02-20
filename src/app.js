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
import * as _ from 'lodash';
import * as d3 from 'd3';
import {setLocale, reportErrorToBackend} from './utils/utils';

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

    //  RestangularProvider.setBaseUrl(config && config.backendUrl);
    // for now we use local dev server
    RestangularProvider.setBaseUrl(__BACKEND_URL__);

    // if state is unknown go to /home

    $urlRouterProvider.otherwise(function ($injector) {
      let $state = $injector.get('$state');
      $state.go('home');
    });


    tmhDynamicLocaleProvider.localeLocationPattern('./angular-locale_{{locale}}.js');

    // use: throw { message: 'error message' };
    $provide.decorator('$exceptionHandler', ['$delegate', '$injector', function ($delegate, $injector) {
      return function (exception, cause) {
        // $delegate(exception, cause);
        $injector.get('$log').log(`Exception: ${exception}`);
        $injector.get('$log').log(`Cause: ${cause}`);
        // reportErrorToBackend(exception, cause, $injector);
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
        let localInjector = angular.injector(['ngLocale']);
        return localInjector.get('$locale');
      }

      // put de-de language into cache
      tmhDynamicLocaleCache.put('de-ch', getInjectedLocale());
      tmhDynamicLocaleCache.put('de', getInjectedLocale());

      // get current language from environment and set the Locale in all
      // relevant libraries:
      // angular (via tmhdynamiclocale), moment, d3, $translate
      if (!_.isUndefined(navigator.globalization)) {
        // mobile phone using Cordova
        navigator.globalization.getPreferredLanguage(function(locale) {
          setLocale(locale, tmhDynamicLocale, $translate, d3, moment, $log);
        }, null);
      } else if (navigator.language || navigator.userLanguage) {
        // Browser
        setLocale(navigator.language || navigator.userLanguage,
          tmhDynamicLocale, $translate, d3, moment, $log);
      }

      // put some general services on $rootScope
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      // handle routing authentication
      $rootScope.$on('$stateChangeStart', stateChangeStartListener);

      $rootScope.$on('$stateChangeSuccess',
        function stateChangeSuccessListener(event, toState, toParams, fromState, fromParams) {
          $log.log('stateChangeSuccess from: ' + (fromState && fromState.name) + ' to: ' + toState.name);
        });

      // log stateChangeErrors
      $rootScope.$on('$stateChangeError', stateChangeErrorListener);


      function stateChangeStartListener(event, toState, toParams, fromState, fromParams) {
        $log.log('stateChangeStart from: ' + (fromState && fromState.name) + ' to: ' + toState.name);

        toState.previous = fromState;

        let requiredAccessLevel = toState.access;

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
          let waitTime = 400;
          $log.log('preventing state change and waiting ' + waitTime + 'ms, Reason:  UserService initialized: ' + UserService.initialized + '"');
          $timeout(function () {
            $state.go(toState, toParams);
          }, waitTime);
        }
      }


      function stateChangeErrorListener(event, toState, toParams, fromState, fromParams, error) {
        let msg = 'Error on StateChange from: "' + (fromState && fromState.name) + '" to:  "' + toState.name + '", err:' +
          error.message + ', code: ' + error.status;
        $log.log(msg);
        $log.log(angular.toJson(error.stack));
        // reportErrorToBackend(error, msg, $injector);

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
      }

    });
