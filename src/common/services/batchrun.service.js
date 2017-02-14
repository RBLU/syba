
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

    this.ignoreRunInStats = (batchRunId, unignore) => {
      return Restangular.all('batchruns').one(batchRunId).customPUT({IGNOREINSTATS: unignore ? 0 : 1});
    }
  }
}

export default BatchRunService;

