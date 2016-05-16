angular.module('app').controller('productDetailsController', function($scope, $http, $stateParams, locker) {

    var productId = $stateParams.productId;
    var url_products = 'http://smartninja.betoo.si/api/eshop/products';

    // Get data
    $http.get(url_products + "/" + productId).then(
        function(success) {
            $scope.product = success.data;
        },
        function(error) {
            alert('Category error.');
        }
    );


    // If product is out of stock.
    $scope.isOnStock = function(onstock) {
        if (onstock === 0) {
            return "Temporary out of stock.";
        }
        return onstock;
    };

    // If product is on sale
    $scope.isOnSale = function(onsale) {
        if (onsale == true) {
            return "This product has a special offer of -30%. Don't miss it!";
        }
        else {
            return "No discount to this product.";
        }
    };

    // If product is available
    $scope.isAvailable = function(available) {
        if (available == null) {
            return "unknown"
        }
        return "Not available until " + available + ".";
    };

    // Define category
    $scope.isCategory = function(category) {
        switch(category) {
            case 1:
                return "Big Toys"; break;
            case 2:
                return "Medium Toys"; break;
            case 3:
                return "Small Toys"; break;
            case 4:
                return "Games"; break;
        }
    };

    /*
    $scope.addToBasket = function(product, quantity) {
        if (quantity > 0 && quantity <= product.stock) {
            var found = false;
            for (var i=0; i<$rootScope.basket.length; i++) {
                if ($rootScope.basket[i].product.id == product.id) {
                    if ($rootScope.basket[i].quantity + parseInt(quantity) > product.stock) {
                        alert("Too much");
                        return;
                    }
                    else {
                        $rootScope.basket[i].quantity += parseInt(quantity);
                        found = true;
                    }
                }
            }
            if (found == false) {
                $rootScope.basket.push({product: product, quantity: parseInt(quantity)});
            }
        }
        else {
            alert("Not enought products in stock.");
        }
    }
    */

    $scope.addToBasket = function(product, quantity) {
        if (quantity > 0 && quantity <= product.stock) {
            var found = false;
            var basket = locker.get("basket");
            for (var i=0; i<basket.length; i++) {
                if (basket[i].product.id == product.id) {
                    if (basket[i].quantity + parseInt(quantity) > product.stock) {
                        alert("Too much");
                        return;
                    }
                    else {
                        basket[i].quantity += parseInt(quantity);
                        found = true;
                    }
                }
            }
            if (found == false) {
                basket.push({product: product, quantity: parseInt(quantity)});
            }

            locker.put("basket", basket);
        }
        else {
            alert("Not enought products in stock.");
        }
    }
});