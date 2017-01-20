import angular from 'angular';
import uiRouter from 'angular-ui-router';
import kennzahlenComponent from './kennzahlen.component';

let kennzahlenModule = angular.module('kennzahlen', [
  uiRouter
])

.directive('kennzahlen', kennzahlenComponent);

export default kennzahlenModule;
