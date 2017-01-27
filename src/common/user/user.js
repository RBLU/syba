import angular from 'angular';
import Base64Module from './base64';

let userModule = angular.module('user', [Base64Module.name])


// Private variable for storing identity information.
var _userRoles = {
    anonymous: 1,
    viewer: 2,
    maintainer: 4,
    administrator: 8,
    developer: 16,
    systemadmin: 32
  },

  _accessLevels = {
    all: _userRoles.anonymous | // 11111
    _userRoles.viewer |
    _userRoles.maintainer |
    _userRoles.administrator |
    _userRoles.developer |
    _userRoles.systemadmin,
    anonymous: _userRoles.anonymous,  // 10000  nur zugänglich,  wenn nicht eingeloggt
    user: _userRoles.viewer |
    _userRoles.orgadmin |
    _userRoles.maintainer |
    _userRoles.administrator |
    _userRoles.developer |
    _userRoles.systemadmin, // 10000  nur zugänglich,  wenn nicht eingeloggt
    maintainer:
    _userRoles.maintainer |
    _userRoles.administrator |
    _userRoles.developer |
    _userRoles.systemadmin,
    administrator:
    _userRoles.administrator |
    _userRoles.developer |
    _userRoles.systemadmin,
    developer:
    _userRoles.developer |
    _userRoles.systemadmin,
    systemadmin: _userRoles.systemadmin
  };
var _emptyDefaultUser = {
  avatar: 'images/default_avatar_woman.png',
  profile: {
    homeAddress: {
      country: 'CH'
    },
    prefs: {
      email: '',
    }
  }
};
var _currentUser = _.clone(_emptyDefaultUser);
var _authenticated = false;

var AUTH_COOKIE_NAME = 'sybaauth';

userModule

// authorization levels and user Roles
  .constant('userRoles', _userRoles)
  .constant('accessLevels', _accessLevels)

  .factory('UserService',
    function (userRoles, localStorageService, $rootScope, Restangular, $location, $http, base64codec, $q) {
      var users = Restangular.all('users');
      var profiles = Restangular.all('profiles');
      var login = Restangular.all('login');
      var validateUser = Restangular.all('/users/validate');

      var _authorize = function authorize(authenticatedUser) {
        // check argument and mandatory keys
        if (!(authenticatedUser && ('username' in authenticatedUser) && (('roles' in authenticatedUser) || ('role' in authenticatedUser)) && ('id' in authenticatedUser))) {
          return $q.reject('Authorize user: incorrect type: ' + angular.toJson(authenticatedUser));
        }

        if (!authenticatedUser.roles || authenticatedUser.roles.length === 0) {
          authenticatedUser.roles = [authenticatedUser.role];
        }

        // if the user is not already authenticated we need to manage data he collected on the user
        if (!_authenticated) {
          // the current, unauthenticated User has a campaign set, this means he clicked on a
          // campaign welcome message "participate"-link
          if (_currentUser.campaign) {
            // --> we need to check whether the authenticated user has the same campaign set, and if
            // not redirect to user the the welcome page so he can really decide whether he wants to swith
            if (authenticatedUser.campaign && (authenticatedUser.campaign.id !== _currentUser.campaign.id)) {
              $rootScope.nextStateAfterLogin = {
                toState: 'welcome',
                toParams: {campaignId: _currentUser.campaign.id}
              };
            }

            // the authenticatedUser does not have a campaign set yet, we need to update the
            // backend object and set the new campaign on it
            if (!authenticatedUser.campaign) {
              $rootScope.$log.log('need to update user');
              authenticatedUser.campaign = _currentUser.campaign;
              authenticatedUser.put();
            }
          }

        }

        // clean current user in order to keep the same reference

        // keep the profile, if the newly authenticated user does not provide an updated populated profile
        var hasProfilePopulated = authenticatedUser.profile && authenticatedUser.profile.id;
        if (!hasProfilePopulated) {
          authenticatedUser.profile = _currentUser.profile;
        }

        // keep the campaign, if the newly authenticated user does not provide an updated populated campaign
        var hasCampaignPopulated = authenticatedUser.campaign && authenticatedUser.campaign.id;
        if (!hasCampaignPopulated) {
          authenticatedUser.campaign = _currentUser.campaign;
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
      var _deauthorize = function () {
        _authenticated = false;
        _currentUser = _.clone(_emptyDefaultUser);

        // Broadcast the deauthorized event
        $rootScope.$broadcast('event:authority-deauthorized');
      };

      var _authorizeLoginResponse = function _authorizeLoginResponse(result) {

        var user = Restangular.restangularizeElement(null, result.user, 'users');

        if (result.token) {
          $http.defaults.headers.common.Authorization = 'Bearer ' + result.token;
        }
        return _authorize(user);
      };

      var UserService = {
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
            var roles = 1;
            if (_.isNumber(rolesToCheck)) {
              roles = rolesToCheck;
            } else if (Array.isArray(rolesToCheck)) {
              roles = _.reduce(rolesToCheck, function (sum, role) {
                return sum | _userRoles[role];
              }, 0);
            } else if (_currentUser && ('roles' in _currentUser) && Array.isArray(_currentUser.roles)) {
              roles = _.reduce(_currentUser.roles, function (sum, role) {
                return sum | _userRoles[role];
              }, 0);
            } else if (_currentUser && ('roles' in _currentUser) && _.isNumber(_currentUser.roles)) {
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
            return _.contains(user.roles, role);
          }
        },
        initialized: false
      };

      var tokenRetrieved = $location.search().token || localStorageService.get(AUTH_COOKIE_NAME);

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
