import angular from 'angular';
import kzhistorygraphComponent from './kzhistorygraph.component';
import './kzhistorygraph.scss';

let kzhistorygraphModule = angular.module('kzhistorygraph', [])

.directive('kzhistorygraph', kzhistorygraphComponent);

export default kzhistorygraphModule;
