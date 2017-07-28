var wallpapersApp = angular.module('wallpapersApp', ['wu.masonry']);
wallpapersApp.controller('WallpapersController', function ($scope, $timeout) {
	$scope.categories = [];
	$scope.images = [];
	$scope.loading_images = false;
	$scope.end_image = false;
	$scope.category = 0;

	$scope.loadCategory = function () {
		$.ajax({
			type: 'POST',
			url: "/categories",
			success: function (categories) {
				$scope.categories = categories;
				$timeout(function () {
					header_init();
				}, 50);
			},
			dataType: 'json',
			async: false
		});
	};
	
	$scope.chooiseCategory = function (category) {
		if ($scope.category === category * 1) {
			return;
		}
		
		$scope.category = category * 1;
		
		$scope.images = [];
		
		$scope.loadImage(30);
	};

	$scope.loadImage = function (count) {
		if ($scope.loading_images || $scope.end_image) {
			return;
		}
		
		$scope.loading_images = true;
		
		$.ajax({
			type: 'POST',
			url: "/images",
			data: {
				"category": $scope.category,
				"start": $scope.images.length,
				"count": count ? count : 12
			},
			success: function (images) {
				if (images.length === 0) {
					$scope.end_image = true;
					return;
				}
				
				for (var i = 0; i < images.length; i++) {
					images[i].delay = i * 100;
					$scope.images.push(images[i]);
				}
				
				$timeout(function () {
					play_animation();
					
					$scope.loading_images = false;
				}, 500);
			},
			dataType: 'json',
			async: false
		});
	};
});

wallpapersApp.directive('scrollTrigger', function ($window) {
	return {
		link: function (scope, element, attrs) {
			var offset = parseInt(attrs.threshold) || 0;
			var e = jQuery(element[0]);
			var doc = jQuery(document);
			angular.element(document).bind('scroll', function () {
				if (doc.scrollTop() + $window.innerHeight + offset > e.offset().top) {
					scope.$apply(attrs.scrollTrigger);
				}
			});
		}
	};
});