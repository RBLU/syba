import moment from 'moment';
import _ from 'lodash';

moment.locale('de_ch');

class BatchesController {
  /* @ngInject */
  constructor($scope, $stateParams, $state, kennzahlenService, batchConfigService, batchRunService , $log, $q) {

    batchConfigService.getBatchConfigs()
      .then((batchConfigs) => {
        this.batches = batchConfigs;
      })
      .then(() => {
        if ($stateParams && $stateParams.batchId) {
          this.selectBatchConfig(_.find(this.batches, (batch) => {return batch.BOID === $stateParams.batchId}));
        } else {
          this.selectBatchConfig(this.batches[0]);
          //TODO: fix Update URL
          //this.$state.go('batches', ({batchId: batch.BOID}))
        }
      })
      .catch( (err) => {
        console.log("error contacting the Backend, using fake data: ", err);
        this.batches = [
          {
            NAME: 'EV Inkasso monatlich',
            BOID: '1121212121',
            runs: [
              {
                BOID: '12341234',
                start: Date.now()
              }
              , {
                BOID: '3234134',
                start: Date.now()
              }
            ]
          },
          {
            NAME: 'EV Inkasso Mutationen',
            BOID: '212341234',
            runs: [
              {
                BOID: '42341234',
                start: Date.now()
              }
              , {
                BOID: '1234211234',
                start: Date.now()
              }
            ]
          },
          {
            NAME: 'Police EV Drucken TEV',
            BOID: '387139271',
            runs: [
              {
                BOID: '12341234',
                start: Date.now()
              } , {
                BOID: '5435345',
                start: Date.now()
              }
            ]
          },
          {
            NAME: 'Police EV Drucken monatlich',
            BOID: '48123741',
            runs: [
              {
                BOID: '12341234',
                start: Date.now()
              }
              , {
                BOID: '22341234',
                start: Date.now()
              }
            ]

          },
          {
            NAME: 'Police EV Drucken JAWE',
            BOID: '58123741',
            runs: [
              {
                BOID: '32341234',
                start: Date.now()
              }
              , {
                BOID: '52341234',
                start: Date.now()
              }
            ]

          },
          {
            NAME: 'Eclaim Import',
            BOID: '613241324',
            runs: [
              {
                BOID: '62341234',
                start: Date.now()
              }
              , {
                BOID: '1261234',
                start: Date.now()
              }
            ]

          },
          {
            NAME: 'Leistungsabrechnung',
            BOID: '723424',
            runs: [
              {
                BOID: '241234',
                start: Date.now()
              }
              , {
                BOID: '52341234',
                start: Date.now()
              }
            ]
          }
        ];
        this.selected = this.batches[0];
        this.runs = this.selected.runs;
      });

    this.kennzahlen = [
      {
        NAME: 'Laufzeit',
        BOID: '324234',
        itsBatchConfig: '1121212121',
        description: 'Misst die zeitliche Dauer eines Laufes in Sekunden',
        settings: [0 , 0,360,410],
        history: []

      },
      {
        NAME: 'Workitems',
        BOID: '5676734',
        itsBatchConfig: '1121212121',
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

    this.selectedrun = null;

    this.selectBatchConfig  = (batchConfig) => {
      $q.all([
        batchConfigService.getBatchConfig(batchConfig.BOID),
        batchRunService.getRuns(batchConfig.BOID)
      ])
        .then((results) => {
          this.selected = results[0];
          this.runs = results[1];

          if ($stateParams && $stateParams.runId) {
            this.selectedrunBoid = $stateParams.runId;
            this.selectBatchRun($stateParams.runId);
          } else {
            this.selectedrunBoid = this.runs[0].BOID;
            this.selectBatchRun(this.runs[0].BOID);
          }
        })
        .catch((err) => {
          $log.log("error contacting backend", err);
        });
    };

    this.selectBatchRun = (runBoid) => {
      if (runBoid) {
        $state.go('batches', {batchId: this.selected.BOID, runId: runBoid}, {notify: false});
        batchRunService.getRun(runBoid)
          .then((run) => {
            this.selectedrun = run;
          });
      }
    };




    this.selectedKz = this.kennzahlen[0];

    this.getRunName = (run) => {
      return moment(run.STARTED).format('lll') + ' (' + run.BOID + ')';
    };

    $scope.$watch('vm.selected', (newbatch, old) => {
      if (newbatch && newbatch.runs) {
        this.selectedrun = newbatch.runs[0];
      }
    });




  }
}

export default BatchesController;
