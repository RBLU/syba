import angular from 'angular';
import Navbar from './navbar/navbar';
import Hero from './hero/hero';
import User from './user/user';
import Kennzahlen from './kennzahlen/kennzahlen';
import Kennzahl from './kennzahl/kennzahl';
import Kzhistorygraph from './kzhistorygraph/kzhistorygraph';

export default angular.module('app.common', [
  Navbar.name,
  Hero.name,
  User.name,
  Kennzahlen.name,
  Kennzahl.name,
  Kzhistorygraph.name
]);
