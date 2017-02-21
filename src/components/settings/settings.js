import angular from 'angular';
import uiRouter from 'angular-ui-router';
import settingsComponent from './settings.component';
import settingsBatchComponent from './settings.batch.component';
import settingsKennzahlenComponent from './settings.kennzahlen.component';
import settingsDefaultsComponent from './settings.defaults.component';
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
        access: 'operator'
      })
      .state('settings.defaults', {
        url: '/defaults',
        template: '<settingsdefaults></settingsdefaults>',
        access: 'operator'
      })
      .state('settings.batch', {
        url: '/batch',
        template: '<settingsbatch></settingsbatch>',
        access: 'operator'
      })
      .state('settings.query', {
        url: '/query',
        template: '<settingsquery></settingsquery>',
        access: 'operator'
      })
      .state('settings.kennzahlen', {
        url: '/kennzahlen',
        template: '<settingskennzahlen></settingskennzahlen>',
        access: 'operator'
      });


  })

  .component('settings', settingsComponent)
  .component('settingsbatch', settingsBatchComponent)
  .component('settingskennzahlen', settingsKennzahlenComponent)
  .component('settingsdefaults', settingsDefaultsComponent)


  ;


export default settingsModule;
