import moment from 'moment';
import _ from 'lodash';

moment.locale('de_ch');

class BatchesController {
  /* @ngInject */
  constructor($scope, $stateParams, $state, batchConfigService, batchRunService , $log, $q) {

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

    this.selectedrun = null;

    this.getRunName = (run) => {
      return moment(run.STARTED).format('lll') + ' (' + run.BOID + ')';
    };

    this.ignoreRunInStats = (run) => {
      batchRunService
        .ignoreRunInStats(run.BOID)
        .then((putResult) => {
          console.log("Put successful", putResult)
          // TODO: reload batchStats
        })
        .catch((err) => {
          console.log("Error putting ignore", err);
        });

    };

    $scope.$watch('vm.selected', (newbatch, old) => {
      if (newbatch && newbatch.runs) {
        this.selectedrun = newbatch.runs[0];
      }
    });




  }
}

export default BatchesController;
