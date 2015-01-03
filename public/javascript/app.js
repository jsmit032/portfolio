angular.module('Portfolio', ['ui.router'])

.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'views/home.html',
			controller: 'HomeController'
		})

		.state('posts', {
			url: '/posts/{id}',
			templateUrl: 'views/posts.html',
			controller: 'PostsCtrl'
		})

		.state('about', {
			url: '/about',
			templateUrl: 'views/about.html'
		});

}])

.factory('posts', [function(){
	var o = {
		posts: []
	};
	return o;
}])

.controller('HomeController', ['$scope', 'posts', function($scope, posts){
	
	$scope.posts = posts.posts;

	$scope.addPost = function(){
		if(!$scope.title || $scope.title === '') { return; }

		$scope.posts.push({
			title: $scope.title,
			link: $scope.link,
			upvotes: 0,
			comments: [
				{author: 'Joe', body: 'Cool post!', upvotes: 0},
				{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
			]
		});

		$scope.title = '';
		$scope.link = '';
	};

	$scope.incrementUpvotes = function(post) {
		post.upvotes += 1;
	};



}])

.controller('PostsCtrl', ['$scope', '$stateParams', 'posts', function($scope, $stateParams, posts){

	$scope.post = posts.posts[$stateParams.id];

	$scope.addComment = function(){
	  if($scope.body === '') { return; }
	  $scope.post.comments.push({
	    body: $scope.body,
	    author: 'user',
	    upvotes: 0
	  });
	  $scope.body = '';
	};

}]);