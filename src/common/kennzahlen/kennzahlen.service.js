class KennzahlenService {
  /* @ngInject */
  constructor(Restangular) {
    this.name = 'kennzahlenService';


    this.getKennzahlHistory = (batchconfigid, kennzahlconfigid) => {
      return Restangular.all('batchconfigs').one(batchconfigid).all('kennzahlvalues').one(kennzahlconfigid).get();
    }

  }
}

export default KennzahlenService;
