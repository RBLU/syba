import angular from 'angular';
import uiRouter from 'angular-ui-router';
import batchesComponent from './batches.component';

let BatchesModule = angular.module('Batches', [
  uiRouter
])

.config(($stateProvider) => {
  $stateProvider
    .state('batches', {
      url: '/batches',
      template: '<batches></batches>'
    });
})

.component('batches', batchesComponent);

export default BatchesModule;
