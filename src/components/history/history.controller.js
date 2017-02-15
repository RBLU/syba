import moment from 'moment';
import _ from 'lodash';

moment.locale('de_ch');

class HistoryController {
  /* @ngInject */
  constructor($scope, $stateParams, $state, kennzahlenService, batchConfigService, batchRunService, $log) {

    this.getRunName = (run) => {
      return moment(run.start).format('lll') + ' (' + run.BOID + ')';
    };

    this.selectBatchConfig = (batchConfigBoid) => {
      return batchConfigService
        .getBatchConfig(batchConfigBoid, {ignored: this.includeIgnored})
        .then((result) => {
          this.selected = result;
        });
    };

    this.selectRun = (runBoid) => {
      batchRunService
        .getRun(runBoid)
        .then((result) => {
          this.selectedrun = result;
        })
    };

    this.selectKz = (batchConfigId, kzConfigId) => {
      kennzahlenService.getKennzahlHistory(batchConfigId, kzConfigId, {includeIgnored: this.includeIgnored})
        .then((result) => {
          this.kennzahl = result;
        });
    };


    batchConfigService.getBatchConfigs()
      .then((batchConfigs) => {
        this.batches = batchConfigs;
        if (!$stateParams.batchId) {
          this.selectBatchConfig(batchConfigs[0].BOID)
            .then(() => {
              this.selectKz(batchConfigs[0].BOID, this.selected.kennzahlStats[0].BOID);
              this.selectedKzBoid = this.selected.kennzahlStats[0].BOID;
              $state.go('history', {batchId: batchConfigs[0].BOID, kennzahlId:  this.selected.kennzahlStats[0].BOID}, {notify: false});
            });
        }
      });


    if ($stateParams && $stateParams.batchId) {
      this.selectBatchConfig($stateParams.batchId);
    }

    if ($stateParams && $stateParams.runId ) {
      this.selectRun($stateParams.runId);
    }

    if ($stateParams && $stateParams.kennzahlId ) {
      this.selectKz($stateParams.batchId, $stateParams.kennzahlId);
      this.selectedKzBoid = $stateParams.kennzahlId;
    }
  }
}

export default HistoryController;
