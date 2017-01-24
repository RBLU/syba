import template from './kzhistorygraph.html';
import controller from './kzhistorygraph.controller';

let kennzahlComponent = function () {
  return {
    restrict: 'E',
    scope: {
      kz: '='
    },
    template,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };
};

export default kennzahlComponent;
