
class SettingsController {
  /* @ngInject */
  constructor(batchConfigService, kennzahlenService, $scope) {

    batchConfigService.getBatchConfigs()
      .then((batchConfigs) => {
        this.batchconfigs = batchConfigs;
      });

    kennzahlenService.getKennzahlen()
      .then((kennzahlen) => {
        this.allkz = kennzahlen;
      });
    this.kzcheckboxes = {};
    kennzahlenService.getKennzahlConfigs()
      .then((kennzahlConfigs) => {
        this.allkzconfigs = kennzahlConfigs;
      });

    this.selectBatchConfig = (batchConfig) => {
      this.selectedbatchconfig = batchConfig;
      this.currentkzs = _.filter(this.allkz, (kz) => {return kz.ITSSYRIUSBATCH == batchConfig.ITSSYRIUSBATCH || !kz.ITSSYRIUSBATCH;});
      this.currentkzconfigs = _.filter(this.allkzconfigs, (kzc) => {return kzc.ITSBATCHCONFIG == batchConfig.BOID;});
      this.selectedkzconfig = undefined;
      this.selectedkz = undefined;
      this.kzcheckboxes = {};
      _.each(this.currentkzconfigs, (kzc) => {
        this.kzcheckboxes[kzc.ITSKENNZAHL] = true;
      });
    };

    this.selectKz = (kz) => {
      this.selectedkzconfig = _.find(this.currentkzconfigs, (kzc) => {return kzc.ITSKENNZAHL == kz.BOID;});
      this.selectedkz = kz;
      if (! this.selectedkzconfig) {
        // this is a newly selected KZ, we need to provide a new kzc for it
        this.selectedkzconfig = {
          ITSKENNZAHL: kz.BOID,
          NAME: kz.NAME,
          DESCRIPTION: kz.DESCRIPTION,
          ACTIVE: 1,
          ITSBATCHCONFIG: this.selectedbatchconfig.BOID,
          ITSSYRIUSBATCH: this.selectedbatchconfig.ITSSYRIUSBATCH
        }
      }
    };

    this.kzCheckboxClicked = (kz) => {
      this.selectKz(kz);
      if (this.kzcheckboxes[kz.BOID]) {
        kennzahlenService.saveKzConfig(this.selectedkzconfig)
          .then((result) => {
            if (result.BOID) {
              this.selectedkzconfig.BOID = result.BOID
              this.allkzconfigs.push(result);
              this.currentkzconfigs.push(result);
            }
          });
      } else {
        kennzahlenService.deleteKzConfig(this.selectedkzconfig);
        this.kzcheckboxes[kz.BOID] = undefined;
        _.remove(this.allkzconfigs, (kzc) => {return kzc.BOID == this.selectedkzconfig.BOID});
        _.remove(this.currentkzconfigs, (kzc) => {return kzc.BOID == this.selectedkzconfig.BOID});
        this.selectedkzconfig = undefined;
        this.selectedkz= undefined;
      }
    };

    this.recalckz = () => {
      console.log('recalc kz: ', this.selectedkzconfig);
    };

    this.formCancel = () => {
      this.selectedbatchconfig = null;
      this.batchconfigform.$setPristine();
      this.batchconfigform.$setUntouched();
    };

    $scope.$watch('vm.selectedkzconfig.BOID', (newBOID, oldBOID) => {
      if (newBOID && newBOID.length >0 && newBOID !== oldBOID) {
        kennzahlenService.getKennzahlConfigById(newBOID)
          .then((kzc) => {
            this.selectedkzconfig = kzc;
          });
      }
    });



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
