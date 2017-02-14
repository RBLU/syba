
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

    this.ignoreRunInStats = (batchRunId, updates) => {

      return Restangular.all('batchruns').one(batchRunId).customPUT({IGNOREINSTATS: 1});
    }
  }
}

export default BatchRunService;

