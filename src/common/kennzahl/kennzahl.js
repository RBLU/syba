import angular from 'angular';
import uiRouter from 'angular-ui-router';
import kennzahlComponent from './kennzahl.component';

let kennzahlModule = angular.module('kennzahl', [
  uiRouter
])

.directive('kennzahl', kennzahlComponent);

export default kennzahlModule;
