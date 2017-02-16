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
  }
}

export default KennzahlenService;
