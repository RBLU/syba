import moment from 'moment';
import _ from 'lodash';

moment.locale('de_ch');

class BatchesController {
  /* @ngInject */
  constructor($scope, $stateParams, $state, batchConfigService, batchRunService , $log, $q) {

    this.selectBatchConfig  = (batchConfig) => {
      $q.all([
        batchConfigService.getBatchConfig(batchConfig.BOID, {includeIgnored: this.includeIgnored}),
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
        console.log("error contacting the Backend", err);
      });

    this.selectedrun = null;

    this.getRunName = (run) => {
      return moment(run.STARTED).format('lll') + ' (' + run.ITSSYRIUSBATCHLAUF + ')';
    };

    this.unignoreRunInStats= (run) => {
      this.ignoreRunInStats(run, true);
    };

    this.ignoreRunInStats = (run, unignore) => {
      batchRunService
        .ignoreRunInStats(run.BOID, unignore)
        .then((putResult) => {
          console.log("Put successful", putResult)
          // reload batchConfig
          this.selectBatchConfig(this.selected);
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
