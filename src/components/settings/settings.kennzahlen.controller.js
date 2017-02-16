
class SettingsController {
  /* @ngInject */
  constructor(batchConfigService, kennzahlenService) {

    batchConfigService.getBatchConfigs()
      .then((batchConfigs) => {
        this.batchconfigs = batchConfigs;
      });

    kennzahlenService.getKennzahlen()
      .then((kennzahlen) => {
        this.kennzahlen = kennzahlen;
      });

    kennzahlenService.getKennzahlConfigs()
      .then((kennzahlConfigs) => {
        this.kennzahlConfigs = kennzahlConfigs;
      });



    this.selectBatchConfig = (batchConfig) => {
      this.selectedbatchconfig = batchConfig;
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

  }

}

export default SettingsController;
