angular.module('Portfolio', ['ui.router'])

.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/');

	//changing home state for landing page purposes
	$stateProvider
		.state('index', {
			url: '/',
			templateUrl: 'default/index.html',
			controller: 'HomeController'
		})

		.state('project-index', {
			url: '/project-index',
			templateUrl: '../views/project-index.html'
		})

		.state('projects', {
			url: '/projects/{id}',
			templateUrl: '../views/projects.html',
			controller: 'ProjectCtrl'
		});

}])

.factory('projects', [function(){
	var o = {
		projects: []
	};
	return o;
}])

.controller('HomeController', ['$scope', 'projects', function($scope, projects){
	
	$scope.projects = projects.projects;

	$scope.addProject = function(){
		if(!$scope.title || $scope.title === '') { return; }

		$scope.projects.push({
			title: $scope.title,
			link: $scope.link,
			upvotes: 0,
			comments: [
				{author: 'Joe', body: 'Cool project!', upvotes: 0},
				{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
			]
		});

		$scope.title = '';
		$scope.link = '';
	};

	$scope.incrementUpvotes = function(project) {
		project.upvotes += 1;
	};



}])

.controller('ProjectCtrl', ['$scope', '$stateParams', 'projects', function($scope, $stateParams, projects){

	$scope.project = projects.projects[$stateParams.id];

	$scope.addComment = function(){
	  if($scope.body === '') { return; }
	  $scope.project.comments.push({
	    body: $scope.body,
	    author: 'user',
	    upvotes: 0
	  });
	  $scope.body = '';
	};

}]);