import angular from 'angular';
import Navbar from './navbar/navbar';
import Hero from './hero/hero';
import User from './user/user';
import Signin from './signin/signin';
import Kennzahlen from './kennzahlen/kennzahlen';
import Kennzahl from './kennzahl/kennzahl';
import Kzhistorygraph from './kzhistorygraph/kzhistorygraph';

export default angular.module('app.common', [
  Navbar.name,
  Hero.name,
  User.name,
  Signin.name,
  Kennzahlen.name,
  Kennzahl.name,
  Kzhistorygraph.name
]);
