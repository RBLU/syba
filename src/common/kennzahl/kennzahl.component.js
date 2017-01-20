import template from './kennzahl.html';
import controller from './kennzahl.controller';

let kennzahlComponent = function () {
  return {
    restrict: 'E',
    scope: {
      kz: '=',
      index: '='
    },
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default kennzahlComponent;
