/** * Created by polona on 29/04/16. */
angular.module('app').controller('homeController', function($scope, $http, $state) {
    $scope.interval = 3000;

    var url_categories = 'http://smartninja.betoo.si/api/eshop/categories';
    var url_products = 'http://smartninja.betoo.si/api/eshop/products';

    var categories = [];
    var products = [];

    // Get data
    $http.get(url_categories).then(
        function(success) {
            $scope.categories = success.data;

            $http.get(url_products).then(
                function(success) {
                    $scope.products = success.data;

                    for (var i=0; i<$scope.products.length; i++) {
                        if($scope.products[i].onSale == true)  {
                            $scope.addSlide($scope.products[i]);
                        }
                    }
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

    var currIndex = 0;
    $scope.slides = [];
    $scope.myInterval = 2000;
    $scope.noWrapSlides = false;
    $scope.active = 0;

    $scope.addSlide = function(product) {
        $scope.slides.push({
            image: product.image,
            name: product.name,
            index: currIndex++,
            id: product.id
        });
    };


    /* Typeaheaad */
    $scope.getItems = function(query){
        return $http.get('http://smartninja.betoo.si/api/eshop/products', {params:{query : query}}).then(function(response) {
            return response.data;
        })
    };

    $scope.onSelect = function($item, $model, $label, $event) {
        $state.go("product-details", {
            productId : $item.id
        })
    }
});