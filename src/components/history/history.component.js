import template from './history.html';
import controller from './history.controller';

let historyComponent = {
  restrict: 'E',
  scope: {},
  template: template,
  controller: controller,
  controllerAs: 'vm'
};

export default historyComponent;
