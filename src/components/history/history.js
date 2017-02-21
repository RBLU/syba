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
      url: '/history/{batchId}/?{runId}&{kennzahlId}',
      template: '<history></history>',
      access: 'user'
    });
})

.component('history', historyComponent);

export default HistoryModule;
