import angular from 'angular';
import uiRouter from 'angular-ui-router';
import settingsComponent from './settings.component';
import settingsBatchComponent from './settings.batch.component';
import settingsKennzahlenComponent from './settings.kennzahlen.component';
import  './settings.scss';

let settingsModule = angular.module('settings', [
  uiRouter
])
/* @ngInject */
  .config(($stateProvider) => {
    $stateProvider
      .state('settings', {
        url: '/settings',
        template: '<settings></settings>',
        access: 'all'
      })
      .state('settings.defaults', {
        url: '/defaults',
        template: '<settingsdefaults></settingsdefaults>',
        access: 'all'
      })
      .state('settings.batch', {
        url: '/batch',
        template: '<settingsbatch></settingsbatch>',
        access: 'all'
      })
      .state('settings.query', {
        url: '/query',
        template: '<settingsquery></settingsquery>',
        access: 'all'
      })
      .state('settings.kennzahlen', {
        url: '/kennzahlen',
        template: '<settingskennzahlen></settingskennzahlen>',
        access: 'all'
      })


  })

  .component('settings', settingsComponent)
  .component('settingsbatch', settingsBatchComponent)
  .component('settingskennzahlen', settingsKennzahlenComponent);

export default settingsModule;
