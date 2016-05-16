/**
 * Created by polona on 28/04/16.
 */
angular.module('app').controller('categoryController', function($scope, $http, $state) {

    var url_categories = 'http://smartninja.betoo.si/api/eshop/categories';
    var url_products = 'http://smartninja.betoo.si/api/eshop/products';

    var products = [];

    // Get data
    $http.get(url_categories).then(
        function(success) {
            $scope.categories = success.data;
            for(var i=0; i<$scope.categories.length; i++) {
                $scope.categoryOptions[$scope.categories[i].id] = true;
            }
            $http.get(url_products).then(
                function(success) {
                    products = success.data;
                    $scope.products = success.data;
                },
                function(error) {
                    alert("Products error.");
                }
            );
        },
        function(error) {
            alert('Category error.');
        }
    );

    $scope.goToDetails = function(id) {
        $state.go("product-details", {productId: id});
    };

    $scope.categoryOptions = [];

    $scope.filterOnCategories = function() {
        $scope.products = [];

        console.log($scope.categoryOptions);

        for(var i=0; i<products.length; i++) {
            var categoryId = products[i].categoryId;

            if ($scope.categoryOptions[categoryId] && $scope.categoryOptions[categoryId] == true) {
                $scope.products.push(products[i]);
            }
        }
    }
});