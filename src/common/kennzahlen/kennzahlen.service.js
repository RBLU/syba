class KennzahlenService {
  /* @ngInject */
  constructor(Restangular) {
    this.name = 'kennzahlenService';


    this.getKennzahlenValues = (batchconfigid, kennzahlconfigid) => {
      return Restangular.all('batchconfigs').one(batchconfigid).all('kennzahlvalues').one(kennzahlconfigid).getList();
    }

  }
}

export default KennzahlenService;
