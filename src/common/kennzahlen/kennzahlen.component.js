import template from './kennzahlen.html';
import controller from './kennzahlen.controller';

let kennzahlenComponent = function () {
  return {
    restrict: 'E',
    scope: {
      kzstats: '=',
      runstats: '='
    },
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default kennzahlenComponent;
