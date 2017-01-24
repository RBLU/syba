import moment from 'moment';

moment.locale('de_ch');

class BatchesController {
  /* @ngInject */
  constructor($scope) {
    this.batches = [
      {
        name: 'EV Inkasso monatlich',
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
        settings: [1000, 2000, 3000, 4000],
        description: 'Misst die Anzahl selektierter Workitems eines Laufes',
        history: [

        ]
      }
    ];


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
