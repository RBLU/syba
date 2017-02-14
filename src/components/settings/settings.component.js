import template from './settings.html';
import controller from './settings.controller';

let settingsComponent = {
  restrict: 'E',
  scope: {},
  template,
  controller,
  controllerAs: 'vm',
  bindToController: true
};

export default settingsComponent;
