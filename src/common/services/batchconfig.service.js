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

    this.getSyriusBatches = () => {
      return Restangular.all('syriusbatches').getList();
    };

    this.post = (newBatchConfig) => {
      return Restangular.all('batchconfigs').post(newBatchConfig);
    };

    this.put = (updatedBatchConfig) => {
      return Restangular.all('batchconfigs').one(updatedBatchConfig.BOID).customPUT(updatedBatchConfig);
    };

    this.delete = (bc) => {
      return Restangular.all('batchconfigs').one(bc.BOID).remove();
    };

    this.reload = (bc) => {
      return Restangular.all('batchconfigs').one(bc.BOID).all('reload').post({}, {});
    };

  }

}

export default BatchConfigService;

