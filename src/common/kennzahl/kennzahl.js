import angular from 'angular';
import uiRouter from 'angular-ui-router';
import kennzahlComponent from './kennzahl.component';
import "./kennzahl.scss";

let kennzahlModule = angular.module('kennzahl', [])

.directive('kennzahl', kennzahlComponent);

export default kennzahlModule;
