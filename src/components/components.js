import angular from 'angular';
import Home from './home/home';
import Settings from './settings/settings';
import Batches from './batches/batches';
import New from './new/new';
import History from './history/history';

export default angular.module('app.components', [
  Home.name,
  Settings.name,
  Batches.name,
  New.name,
  History.name
]);
