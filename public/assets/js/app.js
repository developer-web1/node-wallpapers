var wallpapersApp = angular.module('wallpapersApp', []);
wallpapersApp.controller('WallpapersController', function ($scope, $timeout) {
	$scope.categories = [];
	$scope.images = [];

	$scope.load_category = function () {
		$.ajax({
			type: 'POST',
			url: "/categories",
			success: function (categories) {
				$scope.categories = categories;
				$timeout(function () {
					header_init();

					$scope.load_image();
				}, 50);
			},
			dataType: 'json',
			async: false
		});
	};

	$scope.load_image = function () {
		$.ajax({
			type: 'POST',
			url: "/images",
			data: {
				"start": $scope.images.length,
				"count": 30
			},
			success: function (images) {
				for (var i = 0; i < images.length; i++) {
					$scope.images.push(images[i]);
				}

				$timeout(function () {
					custom_scrollbar();

					play_animation();
				}, 50);
			},
			dataType: 'json',
			async: false
		});
	};
});