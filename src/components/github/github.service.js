class GithubService {
  /* @ngInject */
  constructor($http, $sce) {
    this.$http = $http;
    this.$sce = $sce;
  }

  getItems(githubUsername) {
    var githubUrl = 'https://api.github.com';
    return this.$http({
      method: 'JSONP',
      url: this.$sce.trustAsResourceUrl(githubUrl + '/users/' + githubUsername)
    }).then(function(response) {
      // this callback will be called asynchronously
      // when the response is available
      return response.data;
    }).catch(function(error) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert(error);
    });
  }

}

export default GithubService;
