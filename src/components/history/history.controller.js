import moment from 'moment';

class HistoryController {
  /* @ngInject */
  constructor($scope, $stateParams, $state, kennzahlenService, batchConfigService, batchRunService) {

    this.getRunName = (run) => {
      return moment(run.start).format('lll') + ' (' + run.BOID + ')';
    };

    this.selectbatchconfig = (batchConfigBoid) => {
      return batchConfigService
        .getBatchConfig(batchConfigBoid, {ignored: this.includeIgnored})
        .then((result) => {
          this.selected = result;
          this.selectkz(this.selected.BOID, this.selected.kennzahlStats[0].BOID);

        });
    };

    this.selectRun = (runBoid) => {
      batchRunService
        .getRun(runBoid)
        .then((result) => {
          this.selectedrun = result;
        });
    };

    this.selectkz = (batchConfigId, kzConfigId) => {
      kennzahlenService.getKennzahlHistory(batchConfigId, kzConfigId, {includeIgnored: this.includeIgnored})
        .then((result) => {
          this.kennzahl = result;
          this.selectedKzBoid = result.BOID;
          $state.go('history', {batchId: this.selected.BOID, kennzahlId:  result.BOID}, {notify: false});
        });
    };


    batchConfigService.getBatchConfigs()
      .then((batchConfigs) => {
        this.batches = batchConfigs;
        if (!$stateParams.batchId) {
          this.selectbatchconfig(batchConfigs[0].BOID);
        }
      });


    if ($stateParams && $stateParams.batchId) {
      this.selectbatchconfig($stateParams.batchId);
    }

    if ($stateParams && $stateParams.runId ) {
      this.selectRun($stateParams.runId);
    }

    if ($stateParams && $stateParams.kennzahlId ) {
      this.selectkz($stateParams.batchId, $stateParams.kennzahlId);
      this.selectedKzBoid = $stateParams.kennzahlId;
    }
  }
}

export default HistoryController;
