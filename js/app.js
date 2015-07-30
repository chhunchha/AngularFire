var app = angular.module("fireLearning", ["firebase","ngRoute"]);
var ref = new Firebase("https://fire-learning.firebaseio.com");

app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider){
	$routeProvider
	.when('/',{
		controller: "AuthCtrl",
		templateUrl: "/index.html",
		// resolve: {
		// 	currentAuth: function(Auth) {
		// 		return Auth.$waitForAuth();
		// 	}
		// }
	}).
	// when('/authenticated',{
	// 	//controller: "AuthCtrl",
	// 	templateUrl: "/html/authenticated.html",
	// 	// resolve: {
	// 	// 	currentAuth: function(Auth) {
	// 	// 		return Auth.$waitForAuth();
	// 	// 	}
	// 	// }
	// }).
	// when('/samplepage1',{
	// 	templateUrl: "/html/sample_page1.html",
	// 	controller: "SamplePage1Ctrl"
	// }).
	otherwise({
		redirectTo: '/'
	});
	// .when('/register',{

	// })

	// $locationProvider.html5Mode(
	// 	{
	// 		enabled: true, 
	// 		requiredBase: false
	// 	}
	// );
}]);
var app = angular.module("fireLearning", ["firebase"]);

app.factory("Auth", function($firebaseAuth){
	return $firebaseAuth(ref);
});

app.controller("AuthCtrl", function($scope, Auth, $location){
	$scope.provider = '';
	$scope.authData;

	Auth.$onAuth(function(authData){
		$scope.authData = authData;
		if(authData) {
			$scope.cachedProfile = getCachedProfile();
			createUser();
			//$location.path("/authenticated");
		}
		console.log($scope.authData);
	});

	$scope.login = function(provider) {
		Auth.$authWithOAuthPopup(provider,  { scope: 'email' })
		.catch(function(error){
			console.error(error);
		})
	}

	$scope.logout = function() {
		Auth.$unauth();
	}

	var createUser = function() {
		ref.createUser($scope.cachedProfile, function(error, userData) {
			if (error) {
	 			switch (error.code) {
					case "EMAIL_TAKEN":
						console.log("The new user account cannot be created because the email is already in use.");
						break;
					case "INVALID_EMAIL":
						console.log("The specified email is not a valid email.");
						break;
					default:
						console.log("Error creating user:", error);
				}
			} else {
				console.log("Successfully created user account with uid:", userData.uid);
			}
		});
	}

	var getCachedProfile = function() {
		if(!$scope.authData) return "";

		switch($scope.authData.provider) {
			case "github":
				return $scope.authData.github.cachedUserProfile;
				break;
			case "facebook":
				return $scope.authData.facebook.cachedUserProfile;
				break;
			case "google":
				return $scope.authData.google.cachedUserProfile;
				break;
			default:
				return "";
		}
	}

	$scope.getUserImage = function() {
		if(!$scope.authData) return "";
		
		switch($scope.authData.provider) {
			case "github":
				return $scope.authData.github.cachedUserProfile.avatar_url ? $scope.authData.github.cachedUserProfile.avatar_url : "";
				break;
			case "facebook":
				return $scope.authData.facebook.profileImageURL ? $scope.authData.facebook.profileImageURL : "";
				break;
			case "google":
				return $scope.authData.google.profileImageURL ? $scope.authData.google.profileImageURL : "";
				break;
			default:
				return "";
		}
	}
});