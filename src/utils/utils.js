import _ from 'lodash';


function reportErrorToBackend(exception, cause, $injector) {
  let Restangular = $injector.get('Restangular');
  let $window = $injector.get('$window');
  let UserService = $injector.get('UserService');
  let $rootScope = $injector.get('$rootScope');

  let data = {
    message: exception.message,
    cause: angular.toJson(cause),
    version: $rootScope.appVersion,
    location: $window.location.href,
    userAgent: navigator.userAgent,
    stack: exception.stack,
    username: UserService.principal.getUser().username,
    profileLocation: _.get(UserService.principal.getUser(), 'profile.homeAddress.location'),
    clientTime: new Date().toISOString(),
    clientLocale: moment.locale()
  };

  Restangular.all('/error').post(data);
}

function setLocale(language, tmhDynamicLocale, $translate, d3, moment, $log) {

  let locale = (language.value || language).toLowerCase();

  $log.log('detected system language, setting language to: ' + locale);

  // setting the locale on moment, so we get localized dates and times
  moment.locale(locale);
  $log.log('set moment.js locale to: ' + locale);

  tmhDynamicLocale.set(locale.toLowerCase())
    .then(function (localeSet) {
      return localeSet;
    }, function (err) {
      $log.log('ERROR setting angular internal locale: ' + locale + ', ' + angular.toJson(err));
      if (locale.split('-').length > 1) {
        $log.log('trying short locale: ' + locale.split('-')[0]);
        return tmhDynamicLocale.set(locale.split('-')[0]);
      } else {
        $log.log('ERROR setting angular internal locale: ' + angular.toJson(err) + ', using default');
      }
    })
    .then(function (localeSet) {
      $log.log('set angular internal locale to: ' + localeSet.id);
    }, function (err) {
      $log.log('ERROR setting angular internal locale: ' + angular.toJson(err) + ', using default');
    });

  d3.timeFormatDefaultLocale({
    dateTime: '%A, der %e. %B %Y, %X',
    date: '%d.%m.%Y',
    time: '%H:%M:%S',
    periods: ['AM', 'PM'],
    days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    shortMonths: ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  });

  $translate.use(locale.split('-')[0]).then(function (data) {
    $log.log('set angular-translate locale to: ' + data);
  }, function (error) {
    $log.log('ERROR detecting system language: ' + error);
  });
}


// add field to existing json schema
let addField = function(schema, field) {
  return _.merge(schema, {'properties': field});
};

export {addField, reportErrorToBackend, setLocale}
