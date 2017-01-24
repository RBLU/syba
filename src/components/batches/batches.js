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
      url: '/batches/{batchId}?{tab}',
      template: '<batches></batches>'
    });
})

.component('batches', batchesComponent);

export default BatchesModule;
