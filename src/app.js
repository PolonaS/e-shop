angular.module('app', ['ui.router', 'ui.bootstrap', 'angular-carousel', 'angular-locker']);

angular.module('app').config(function($stateProvider, $urlRouterProvider, lockerProvider){
    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        controller: 'homeController',
        templateUrl: 'templates/home.html'
    });
    $stateProvider.state('categories', {
        url: '/categories',
        controller: 'categoryController',
        templateUrl: 'templates/categories.html'
        //templateUrl: 'components/categories/categories.html'
    });
    $stateProvider.state('product', {
        url: '/product',
        //templateUrl: 'components/product-details/product-details.html'
        templateUrl: 'templates/categories.html'
    });
    $stateProvider.state('basket', {
        url: '/basket',
        controller: 'basketController',
        templateUrl: 'templates/basket.html'
    });
    $stateProvider.state('purchase-form', {
        url: '/purchase-form',
        controller: 'purchaseController',
        templateUrl: 'templates/purchase-form.html'
    });
    $stateProvider.state('product-details', {
        url: '/product-details/:productId',
        controller: 'productDetailsController',
        templateUrl: 'templates/product-details.html'
    });

    lockerProvider.defaults({
        driver: "local",
        namespace: "app"
    });
});
