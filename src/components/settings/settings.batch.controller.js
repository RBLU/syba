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

  }

}

export default SettingsController;
