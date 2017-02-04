import angular from 'angular';
import uiRouter from 'angular-ui-router';
import batchesComponent from './batches.component';

let BatchesModule = angular.module('Batches', [
  uiRouter
])

/* @ngInject */
.config(($stateProvider) => {
  $stateProvider
    .state('batches', {
      url: '/batches/{batchId}/{run}',
      template: '<batches></batches>',
      access: 'all'
    });
})

.component('batches', batchesComponent);

export default BatchesModule;
