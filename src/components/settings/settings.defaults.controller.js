import _ from 'lodash';

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
      };
    };

    this.selectBatchConfig = (batchConfig) => {
      this.selectedbatchconfig = _.clone(batchConfig);
      this.selectedsyrbatch = _.find(this.syriusbatches, (sb) => {
        return sb.BOID == batchConfig.ITSSYRIUSBATCH;
      });
    };



  }

}

export default SettingsController;
