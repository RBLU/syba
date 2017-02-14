
class BatchRunService {
  /* @ngInject */
  constructor(Restangular) {
    this.name = 'batchRunService';


    this.getRuns = (batchConfigId) => {
      return Restangular.all('batchruns').getList({ITSBATCHCONFIG: batchConfigId});
    }

    this.getRun = (batchRunId) => {
      return Restangular.all('batchruns').one(batchRunId).get();
    }

  }
}

export default BatchRunService;

