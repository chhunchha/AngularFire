var app = angular.module("fireLearning", ["firebase"]);

app.factory("Auth", function($firebaseAuth){
	var ref = new Firebase("https://fire-learning.firebaseio.com");
	return $firebaseAuth(ref);
});

app.controller("AuthCtrl", function($scope, Auth){
	$scope.login = function() {
		Auth.$authWithOAuthPopup("github")
		.then(function(authData){
			console.log(authData);
		}).catch(function(error){
			console.error(error);
		})
	}
});