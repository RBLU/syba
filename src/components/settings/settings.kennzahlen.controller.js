
class SettingsController {
  /* @ngInject */
  constructor(batchConfigService, kennzahlenService) {

    batchConfigService.getBatchConfigs()
      .then((batchConfigs) => {
        this.batchconfigs = batchConfigs;
      });

    kennzahlenService.getKennzahlen()
      .then((kennzahlen) => {
        this.allkz = kennzahlen;
      });

    kennzahlenService.getKennzahlConfigs()
      .then((kennzahlConfigs) => {
        this.allkzconfigs = kennzahlConfigs;
      });

    this.selectBatchConfig = (batchConfig) => {
      this.selectedbatchconfig = batchConfig;
      this.currentkz = _.filter(this.allkz, (kz) => {return kz.ITSSYRIUSBATCH == batchConfig.ITSSYRIUSBATCH || !kz.ITSSYRIUSBATCH;});
      this.currentkzconfig = _.filter(this.allkzconfigs, (kzc) => {return kzc.ITSBATCHCONFIG == batchConfig.BOID;});
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
