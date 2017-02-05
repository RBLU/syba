class KennzahlenController {
  constructor($scope) {
    this.name = 'kennzahlen';

    this.data = [
      {
        boid: '324234',
        name: 'Laufzeit',
        value: 234,
        settings: [0,0,280,410],
        minMaxHist: [40, 420],
        medValue: 200,
        stdAbw: 40,
        min: 0,
        max: 500
      },
      {
        boid: '5676734',
        name: 'Items',
        value: 2800,
        settings: [1000, 2000, 3000, 4000],
        minMaxHist: [1920,4234],
        medValue: 2344,
        stdAbw: 120,
        min: 0,
        max: 5000
      }
    ];
    $scope.$watch(['vm.runid', 'vm.batchid'], (newRUnId) => {
      if (this.runid && this.batchid) {
        // get all needed Kz for this run and set to this.data
      }
    });
  }
}

export default KennzahlenController;
