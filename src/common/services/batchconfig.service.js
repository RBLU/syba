
class BatchConfigService {
  /* @ngInject */
  constructor(Restangular) {
    this.name = 'batchConfigService';


    this.getBatchConfigs = () => {
      return Restangular.all('batchconfigs').getList();
    };

    this.getBatchConfig = (boid, params) => {
      return Restangular.all('batchconfigs').one(boid).get(params);
    };
  }
}

export default BatchConfigService;

