import template from './settings.defaults.html';
import controller from './settings.defaults.controller';

let settingsDefaultsComponent = {
  restrict: 'E',
  scope: {},
  template,
  controller,
  controllerAs: 'vm',
  bindToController: true
};

export default settingsDefaultsComponent;
