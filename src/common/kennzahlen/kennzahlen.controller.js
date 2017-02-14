class KennzahlenController {
  /* @ngInject */
  constructor($scope) {
    this.name = 'kennzahlen';

    this.$onInit = () => {
      $scope.$watchGroup(['vm.kzstats', 'vm.runstats'], () => {
        console.log("kennzahlencontroller: ", this.kzstats, this.runstats);
        if (this.kzstats && this.kzstats.length > 0 && this.runstats && this.runstats.length > 0) {
          this.kennzahlen = _.map(this.kzstats, (kzstat) => {
            return {kzstat: kzstat, runstat: _.find(this.runstats, (runstat) => {return kzstat.ITSKENNZAHLCONFIG == runstat.ITSKENNZAHLCONFIG})}
          });
        }
      });
    };
  }
}

export default KennzahlenController;
