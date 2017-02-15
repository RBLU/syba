
class SettingsController {
  /* @ngInject */
  constructor(batchConfigService) {
    batchConfigService.getSyriusBatches()
      .then((batches) => {
        this.syriusbatches = batches;
      });


    batchConfigService.getBatchConfigs()
      .then((batchConfigs) => {
        this.batchconfigs = batchConfigs;
      });

    this.selectSyriusBatch = (syriusBatch) => {
      // check dirty Form
      this.selectedsyrbatch = syriusBatch;
      this.selectedbatchconfig = {
        ITSSYRIUSBATCH: syriusBatch.BOID,
        NAME: '',
        DESCRIPTION: '',
        ACTIVE: 1
      }
    };

    this.selectBatchConfig = (batchConfig) => {
      this.selectedbatchconfig = _.clone(batchConfig);
      this.selectedsyrbatch= _.find(this.syriusbatches, (sb) => {return sb.BOID == batchConfig.ITSSYRIUSBATCH});
    };

    this.formCancel = () => {
      this.selectedbatchconfig = null;
      this.batchconfigform.$setPristine();
      this.batchconfigform.$setUntouched();
    };

    this.formSubmit = () => {
      if (this.selectedbatchconfig.BOID) {
        // this is an update
        batchConfigService
          .put(this.selectedbatchconfig)
          .then((result) => {});

      } else {
        // this is a new BatchConfig
        batchConfigService
          .post(this.selectedbatchconfig)
          .then((result) => {
            this.batchconfigs.push(result);
            this.selectedbatchconfig = result;
          });
      }
      this.batchconfigform.$setPristine();
      this.batchconfigform.$setUntouched();
    };

    this.deleteBatchConfig = () => {
      batchConfigService
        .delete(this.selectedbatchconfig)
        .then((result) => {
          _.remove(this.batchconfigs, (config) => {return config.BOID === this.selectedbatchconfig.BOID;});
          this.selectedbatchconfig = null;
          this.batchconfigform.$setPristine();
          this.batchconfigform.$setUntouched();
        });
    };

    this.reloadBatchConfig = () => {
      batchConfigService.reload(this.selectedbatchconfig)
        .then((result) => {this.reloadResult = result;});
    }

  }

}

export default SettingsController;
