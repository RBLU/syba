class KennzahlenService {
  /* @ngInject */
  constructor(Restangular) {
    this.name = 'kennzahlenService';

    this.getKennzahlHistory = (batchconfigid, kennzahlconfigid, params) => {
      return Restangular.all('batchconfigs').one(batchconfigid).all('kennzahlvalues').one(kennzahlconfigid).get(params);
    };

    this.getKennzahlen = () => {
      return Restangular.all('kennzahlen').getList();
    };

    this.getKennzahlConfigs = () => {
      return Restangular.all('kennzahlconfigs').getList();
    };

    this.saveKzConfig = (kzc) => {
      if (kzc.BOID) {
        return Restangular.all('kennzahlconfigs').one(kzc.BOID).customPUT(kzc);
      } else {
        return Restangular.all('kennzahlconfigs').post(kzc);
      }
    };

    this.deleteKzConfig = (kzc) => {
      return Restangular.all('kennzahlconfigs').one(kzc.BOID).remove();
    };

    this.getKennzahlConfigById = (kzcBOID) => {
      return Restangular.all('kennzahlconfigs').one(kzcBOID).get();
    }
  }
}

export default KennzahlenService;
