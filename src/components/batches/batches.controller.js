import moment from 'moment';
import _ from 'lodash';

moment.locale('de_ch');

class BatchesController {
  /* @ngInject */
  constructor($scope, $stateParams, $state, kennzahlenService) {
    this.batches = [
      {
        name: 'EV Inkasso monatlich',
        boid: '1121212121',
        runs: [
          {
            boid: '12341234',
            start: Date.now()
          }
          , {
            boid: '3234134',
            start: Date.now()
          }
        ]
      },
      {
        name: 'EV Inkasso Mutationen',
        boid: '212341234',
        runs: [
          {
            boid: '42341234',
            start: Date.now()
          }
          , {
            boid: '1234211234',
            start: Date.now()
          }
        ]
      },
      {
        name: 'Police EV Drucken TEV',
        boid: '387139271',
        runs: [
          {
            boid: '12341234',
            start: Date.now()
          } , {
            boid: '12341234',
            start: Date.now()
          }
        ]
      },
      {
        name: 'Police EV Drucken monatlich',
        boid: '48123741',
        runs: [
          {
            boid: '12341234',
            start: Date.now()
          }
          , {
            boid: '22341234',
            start: Date.now()
          }
        ]

      },
      {
        name: 'Police EV Drucken JAWE',
        boid: '58123741',
        runs: [
          {
            boid: '32341234',
            start: Date.now()
          }
          , {
            boid: '52341234',
            start: Date.now()
          }
        ]

      },
      {
        name: 'Eclaim Import',
        boid: '613241324',
        runs: [
          {
            boid: '62341234',
            start: Date.now()
          }
          , {
            boid: '1261234',
            start: Date.now()
          }
        ]

      },
      {
        name: 'Leistungsabrechnung',
        boid: '723424',
        runs: [
          {
            boid: '241234',
            start: Date.now()
          }
          , {
            boid: '52341234',
            start: Date.now()
          }
        ]
      }
    ];

    this.kennzahlen = [
      {
        name: 'Laufzeit',
        id: '324234',
        description: 'Misst die zeitliche Dauer eines Laufes in Sekunden',
        settings: [0 , 0,360,410],
        history: []

      },
      {
        name: 'Workitems',
        id: '5676734',
        settings: [1000, 1500, 3000, 4000],
        description: 'Misst die Anzahl selektierter Workitems eines Laufes',
        history: [
          {
            lauf: '89875',
            STARTED: moment().subtract(1, 'day').toDate(),
            NUMBERVALUE: '1234'
          },
          {
            lauf: '89876',
            STARTED: moment().subtract(2, 'day').toDate(),
            NUMBERVALUE: '2344'
          },
          {
            lauf: '89877',
            STARTED: moment().subtract(3, 'day').toDate(),
            NUMBERVALUE: '1901'
          },
          {
            lauf: '89877',
            STARTED: moment().subtract(3, 'day').subtract(1, 'hour').toDate(),
            NUMBERVALUE: '1200'
          },
          {
            lauf: '89877',
            STARTED: moment().subtract(3, 'day').subtract(2, 'hour').toDate(),
            NUMBERVALUE: '1400'
          },
          {
            lauf: '89877',
            STARTED: moment().subtract(3, 'day').subtract(5, 'hour').toDate(),
            NUMBERVALUE: '2021'
          },
          {
            lauf: '89878',
            STARTED: moment().subtract(4, 'day').toDate(),
            NUMBERVALUE: '1834'
          },
          {
            lauf: '89879',
            STARTED: moment().subtract(5, 'day').toDate(),
            NUMBERVALUE: '2102'
          },
          {
            lauf: '89880',
            STARTED: moment().subtract(6, 'day').toDate(),
            NUMBERVALUE: '2080'
          },
          {
            lauf: '89890',
            STARTED: moment().subtract(7, 'day').toDate(),
            NUMBERVALUE: '712'
          },
          {
            lauf: '89891',
            STARTED: moment().subtract(8, 'day').toDate(),
            NUMBERVALUE: '4100'
          },
          {
            lauf: '89892',
            STARTED: moment().subtract(9, 'day').toDate(),
            NUMBERVALUE: '0'
          },
          {
            lauf: '89893',
            STARTED: moment().subtract(10, 'day').toDate(),
            NUMBERVALUE: '3212'
          },
          {
            lauf: '89894',
            STARTED: moment().subtract(11, 'day').toDate(),
            NUMBERVALUE: '3203'
          },
        ]
      }
    ];

    kennzahlenService.getKennzahlenValues('MPolEvDrucken', 'MLaufzeitConfigPoliceEV')
      .then((result) => {
        this.kennzahlen[0].history = result;
      });

    if ($stateParams && $stateParams.batchId) {
      this.selected = _.find(this.batches, (batch) => {return batch.boid === $stateParams.batchId})
    }

    if ($stateParams && $stateParams.tab) {
      this.activetab = +$stateParams.tab;
    }

    this.tabChanged = (newIndex) => {
      $state.go('batches', {batchId: this.selected.boid, tab: newIndex },
        {
          location: 'replace',
          inherit: false,
          notify: false
        })
    };


    this.select  = (batch) => {
      this.selected = batch;
    };

    this.selectedKz = this.kennzahlen[0];

    this.getRunName = (run) => {
      return moment(run.start).format('lll') + ' (' + run.boid + ')';
    };

    $scope.$watch('vm.selected', (newbatch, old) => {
      if (newbatch && newbatch.runs) {
        this.run = newbatch.runs[0];
      }
    });




  }
}

export default BatchesController;
