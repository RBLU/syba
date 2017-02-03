import angular from 'angular';
import uiRouter from 'angular-ui-router';
import kennzahlenComponent from './kennzahlen.component';
import kennzahlenService from './kennzahlen.service';

let kennzahlenModule = angular.module('kennzahlen', [
  uiRouter
])

.directive('kennzahlen', kennzahlenComponent)
.service('kennzahlenService', kennzahlenService);

export default kennzahlenModule;
