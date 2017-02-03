import angular from 'angular';
import Home from './home/home';
import Github from './github/github';
import Batches from './batches/batches';
import New from './new/new';
import History from './history/history';

export default angular.module('app.components', [
  Home.name,
  Github.name,
  Batches.name,
  New.name,
  History.name
]);
