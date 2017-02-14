
class BatchConfigService {
  /* @ngInject */
  constructor(Restangular) {
    this.name = 'batchConfigService';


    this.getBatchConfigs = () => {
      return Restangular.all('batchconfigs').getList();
    };

    this.getBatchConfig = (boid) => {
      return Restangular.all('batchconfigs').one(boid).get();
    };
  }
}

export default BatchConfigService;

