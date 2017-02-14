import template from './settings.batch.html';
import controller from './settings.batch.controller';

let settingsBatchComponent = {
  restrict: 'E',
  scope: {},
  template,
  controller,
  controllerAs: 'vm',
  bindToController: true
};

export default settingsBatchComponent;
