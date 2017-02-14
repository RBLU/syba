import angular from 'angular';
import BatchConfigService from './batchconfig.service';
import BatchRunService from './batchrun.service';


let ServicesModule = angular.module('services', [
])


  .service('batchConfigService', BatchConfigService)
  .service('batchRunService', BatchRunService)
  ;

export default ServicesModule;