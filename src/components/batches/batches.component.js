import template from './batches.html';
import controller from './batches.controller';

let batchesComponent = {
  restrict: 'E',
  scope: {},
  template: template,
  controller: controller,
  controllerAs: 'vm'
};

export default batchesComponent;
