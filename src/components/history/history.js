import angular from 'angular';
import uiRouter from 'angular-ui-router';
import historyComponent from './history.component';

let HistoryModule = angular.module('History', [
  uiRouter
])

/* @ngInject */
.config(($stateProvider) => {
  $stateProvider
    .state('history', {
      url: '/history/{batchId}?{tab}&{run}',
      template: '<history></history>',
      access: 'all'
    });
})

.component('history', historyComponent);

export default HistoryModule;
