import angular from 'angular';
import Base64Module from './base64';
import _ from 'lodash';


// Private variable for storing identity information.
var _userRoles = {
    anonymous: 1,
    viewer: 2,
    operator: 4,
    administrator: 8,
    developer: 16,
    systemadmin: 32
  },

  _accessLevels = {
    all: _userRoles.anonymous | // 11111
    _userRoles.viewer |
    _userRoles.operator |
    _userRoles.administrator |
    _userRoles.developer |
    _userRoles.systemadmin,
    anonymous: _userRoles.anonymous,  // 10000  nur zugänglich,  wenn nicht eingeloggt
    user: _userRoles.viewer |
    _userRoles.operator |
    _userRoles.administrator |
    _userRoles.developer |
    _userRoles.systemadmin,
    operator: _userRoles.operator |
    _userRoles.administrator |
    _userRoles.developer |
    _userRoles.systemadmin,
    administrator: _userRoles.administrator |
    _userRoles.developer |
    _userRoles.systemadmin,
    developer: _userRoles.developer |
    _userRoles.systemadmin,
    systemadmin: _userRoles.systemadmin
  };

let _emptyDefaultUser = {
};

let _currentUser = _.clone(_emptyDefaultUser);
let _authenticated = false;

let AUTH_COOKIE_NAME = 'sybaauth';

let userModule = angular.module('user', [Base64Module.name])

// authorization levels and user Roles
  .constant('userRoles', _userRoles)
  .constant('accessLevels', _accessLevels)
  /* @ngInject */
  .factory('UserService',
    function (userRoles, localStorageService, $rootScope, Restangular, $location, $http, base64codec, $q, $log) {
      let users = Restangular.all('users');
      let profiles = Restangular.all('profiles');
      let login = Restangular.all('login');
      let validateUser = Restangular.all('/users/validate');

      let _authorize = function authorize(authenticatedUser) {
        // check argument and mandatory keys
        if (!(authenticatedUser && ('USERNAME' in authenticatedUser)
          && ('ROLES' in authenticatedUser)
          && ('BOID' in authenticatedUser))) {
          return $q.reject('Authorize user: incorrect type: ' + angular.toJson(authenticatedUser));
        }


        _.forEach(_.keys(_currentUser), function (key) {
          delete _currentUser[key];
        });

        // merge the user obj recursively to the current user
        _.merge(_currentUser, authenticatedUser);

        _authenticated = true;

        // Broadcast the authorized event
        $rootScope.$broadcast('event:authority-authorized');
        return authenticatedUser;
      };

      // `deauthorize` resets the `principal` and `identity`
      let _deauthorize = function () {
        _authenticated = false;
        $log.log('current User before logout', _currentUser);

        _.each(_currentUser, (value, key) => {
          _.unset(_currentUser, key);
        });

        $log.log('current User after logout', _currentUser);
        // Broadcast the deauthorized event
        $rootScope.$broadcast('event:authority-deauthorized');
      };

      let _authorizeLoginResponse = function _authorizeLoginResponse(result) {

        let user = Restangular.restangularizeElement(null, result.user, 'users');

        if (result.token) {
          $http.defaults.headers.common.Authorization = 'Bearer ' + result.token;
        }
        return _authorize(user);
      };

      let UserService = {
        encodeCredentials: function (username, password) {
          return ({username: username, password: password});
        },
        login: function (cred, keepMeLoggedIn) {

          if (_.isString(cred)) {
            // this is a token so we use bearer token mode
            $http.defaults.headers.common.Authorization = 'Bearer ' + cred;

          } else if (_.isObject(cred) && cred.username && cred.password) {
            // this is a username and password, so we use Basic Auth
            $http.defaults.headers.common.Authorization = 'Basic ' + base64codec.encode(cred.username + ':' + cred.password);
          }

          return login.post()
            .then(function success(result) {

              if (keepMeLoggedIn) {
                localStorageService.set(AUTH_COOKIE_NAME, result.token || cred);
              }
              return _authorizeLoginResponse(result);

            }, function error(err) {
              $http.defaults.headers.common.Authorization = '';

              if (err.data && err.data.code === 'UnauthorizedError') {
                $rootScope.$emit('clientmsg:error', 'loginFailed', {error: err});
              } else {
                $rootScope.$emit('clientmsg:error', err);
              }

              return $q.reject(err);
            });
        },
        reload: function () {
          return login.post({}).then(_authorizeLoginResponse);
        },
        logout: function () {
          localStorageService.remove(AUTH_COOKIE_NAME);
          $http.defaults.headers.common.Authorization = '';
          _deauthorize();
          return $q.when(null);
        },
        validateUser: function (user) {
          return validateUser.post(user);
        },
        submitNewUser: function (newuser) {
          newuser.roles = ['individual'];
          newuser.fullname = newuser.firstname + ' ' + newuser.lastname;

          // set the username to the user's email
          newuser.username = newuser.email;

          // in case this was an unauthenticated user who was browsing and collecting data,
          // we need to merge the user we submit with the data we have already collected
          if (!_authenticated) {
            newuser = _.merge(newuser, _currentUser);
          }

          return users.post(newuser);
        },
        putUser: function (user) {
          return Restangular.restangularizeElement(null, user, 'users').put().then(function success(updatedUser) {
            // check whether we have updated the current user, if yes update our session object
            if (_currentUser.id === updatedUser.id) {
              _authorize(updatedUser);
            }
            return updatedUser;
          });
        },
        sendVerificationEmail: function (userId) {
          return users.one(userId).all('send_verification_email').post();
        },
        verifyEmail: function (userId, token) {
          return users.one(userId).all('email_verification').post({token: token});
        },
        requestPasswordReset: function (usernameOrEmail) {
          return users.all('request_password_reset').post({usernameOrEmail: usernameOrEmail});
        },
        passwordReset: function (token, newPassword) {
          return users.all('password_reset').post({token: token, password: newPassword});
        },
        getUser: function (userId, options) {
          return users.one(userId).get(options);
        },
        getUsers: function (options) {
          return users.getList(options);
        },
        getProfiles: function (options) {
          return profiles.getList(options);
        },
        hasDefaultAvatar: function (user) {
          return (user || UserService.principal.getUser()).avatar.lastIndexOf('/assets/img/default') !== -1;
        },
        deleteUser: function (id) {
          return users.one(id).remove();
        },
        principal: {
          getUser: function () {
            return _currentUser;
          },
          isAuthenticated: function () {
            return _authenticated;
          },
          isAuthorized: function (reqAccessLevel, rolesToCheck) {
            let roles = 1;
            if (_.isNumber(rolesToCheck)) {
              roles = rolesToCheck;
            } else if (_.isArray(rolesToCheck)) {
              roles = _.reduce(rolesToCheck, function (sum, role) {
                return sum | _userRoles[role];
              }, 0);
            } else if (_currentUser && ('ROLES' in _currentUser) && _.isString(_currentUser.ROLES)) {
              roles = _.reduce(_currentUser.ROLES.split(','), function (sum, role) {
                return sum | _userRoles[role];
              }, 0);
            } else if (_currentUser && ('ROLES' in _currentUser) && _.isNumber(_currentUser.ROLES)) {
              roles = _currentUser.role;
            }

            if (_.isString(reqAccessLevel)) {
              reqAccessLevel = _accessLevels[reqAccessLevel];
            }
            return reqAccessLevel & roles;
          },
          hasRole: function (role, user) {
            if (!user) {
              user = _currentUser;
            }
            return _.contains(user.ROLES, role);
          }
        },
        initialized: false
      };

      let tokenRetrieved = $location.search().token || localStorageService.get(AUTH_COOKIE_NAME);

      if (tokenRetrieved) {
        UserService.login(tokenRetrieved, true)
          .then(function success(user) {
            UserService.initialized = true;
          }, function error(err) {
            localStorageService.remove(AUTH_COOKIE_NAME);
            UserService.initialized = true;
          });
      } else {
        UserService.initialized = true;
      }

      return UserService;
    });

export default userModule;
