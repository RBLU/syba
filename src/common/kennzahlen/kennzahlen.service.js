class KennzahlenService {
  /* @ngInject */
  constructor(Restangular) {
    this.name = 'kennzahlenService';


    this.getKennzahlHistory = (batchconfigid, kennzahlconfigid, params) => {
      return Restangular.all('batchconfigs').one(batchconfigid).all('kennzahlvalues').one(kennzahlconfigid).get(params);
    }

  }
}

export default KennzahlenService;
