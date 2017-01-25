import moment from 'moment';
import _ from 'lodash';

moment.locale('de_ch');

class BatchesController {
  /* @ngInject */
  constructor($scope, $stateParams, $state) {
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
        history: [
          {
            lauf: '89875',
            start: moment().subtract(1, 'day').toDate(),
            value: '234'
          },
          {
            lauf: '89875',
            start: moment().subtract(2, 'day').toDate(),
            value: '223'
          },
          {
            lauf: '89875',
            start: moment().subtract(3, 'day').toDate(),
            value: '290'
          },
          {
            lauf: '89875',
            start: moment().subtract(4, 'day').toDate(),
            value: '265'
          },
          {
            lauf: '89875',
            start: moment().subtract(5, 'day').toDate(),
            value: '450'
          },
          {
            lauf: '89875',
            start: moment().subtract(6, 'day').toDate(),
            value: '330'
          },
          {
            lauf: '89875',
            start: moment().subtract(7, 'day').toDate(),
            value: '320'
          },
          {
            lauf: '89875',
            start: moment().subtract(8, 'day').toDate(),
            value: '267'
          }
        ]

      },
      {
        name: 'Workitems',
        id: '5676734',
        settings: [1000, 1500, 3000, 4000],
        description: 'Misst die Anzahl selektierter Workitems eines Laufes',
        history: [
          {
            lauf: '89875',
            start: moment().subtract(1, 'day').toDate(),
            value: '1234'
          },
          {
            lauf: '89876',
            start: moment().subtract(2, 'day').toDate(),
            value: '2344'
          },
          {
            lauf: '89877',
            start: moment().subtract(3, 'day').toDate(),
            value: '1901'
          },
          {
            lauf: '89877',
            start: moment().subtract(3, 'day').subtract(1, 'hour').toDate(),
            value: '1200'
          },
          {
            lauf: '89877',
            start: moment().subtract(3, 'day').subtract(2, 'hour').toDate(),
            value: '1400'
          },
          {
            lauf: '89877',
            start: moment().subtract(3, 'day').subtract(5, 'hour').toDate(),
            value: '2021'
          },
          {
            lauf: '89878',
            start: moment().subtract(4, 'day').toDate(),
            value: '1834'
          },
          {
            lauf: '89879',
            start: moment().subtract(5, 'day').toDate(),
            value: '2102'
          },
          {
            lauf: '89880',
            start: moment().subtract(6, 'day').toDate(),
            value: '2080'
          },
          {
            lauf: '89890',
            start: moment().subtract(7, 'day').toDate(),
            value: '712'
          },
          {
            lauf: '89891',
            start: moment().subtract(8, 'day').toDate(),
            value: '4100'
          },
          {
            lauf: '89892',
            start: moment().subtract(9, 'day').toDate(),
            value: '0'
          },
          {
            lauf: '89893',
            start: moment().subtract(10, 'day').toDate(),
            value: '3212'
          },
          {
            lauf: '89894',
            start: moment().subtract(11, 'day').toDate(),
            value: '3203'
          },
        ]
      }
    ];

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
