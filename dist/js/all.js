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

angular.module('app').controller('indexController', function(locker) {
    if(locker.get("basket") == null)
        locker.put("basket", []);

    //$rootScope.basket = [];
});
angular.module('app').directive('footerLoad', function(){
    return {
        restrict: 'E',
        templateUrl: 'templates/footer.html'
    };
});
angular.module('app').directive('headerLoad', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/header.html'
    };
});

angular.module('app').controller('basketController', function($scope, $filter, $state, $uibModal, locker) {

    //$scope.basket = $rootScope.basket;

    $scope.basket = locker.get("basket");

    $scope.sumAll = 2;

    $scope.sumAllProducts = function() {
        var sum = 0;
        for (var i=0; i<$scope.basket.length; i++) {
            sum += $scope.basket[i].product.price * $scope.basket[i].quantity;
        }
        return $filter('currency')(sum, '$');
    };

    $scope.deleteProduct = function(id) {
        var index = null;
        var basket = locker.get("basket");

        for (var i=0; i<basket.length; i++) {
            if(basket[i].product.id == id) {
                index = i;
                break;
            }
        }
        if(index !== null){
            basket.splice(index, 1);
        }

        locker.put("basket", basket);
        $scope.basket = basket;
    };

    $scope.goToPurchaseForm = function(){
        $state.go("purchase-form");
    };

    $scope.previewBasket = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/modal-template.html',
            controller:  'modalController',
            resolve:     {
                input: function () {
                    return $scope.sumAllProducts();
                }
            }
        });

        modalInstance.result.then(function (success){
           // alert(success);
        }, function (error) {
            alert(error);
        });
    };
});


angular.module('app').controller('modalController', function($scope, input, $uibModalInstance) {

     /* Modal window */
     $scope.data = input;

     $scope.ok = function () {
         $uibModalInstance.close('Success');
     };
});



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
angular.module('app').directive('appTypeahead', function(){
    return {
        restrict: 'E',
        controller: 'homeController',
        templateUrl: 'templates/typeahead-template.html'
    };
});
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
/**
 * Created by polona on 15/05/16.
 */
angular.module('app').directive('appDatepicker', function(){
    return {
        restrict: 'E',
        controller: 'purchaseController',
        templateUrl: 'templates/datepicker-directive.html'
    };
});
angular.module('app').controller('purchaseController', function($scope, $http, locker){

    var url_reservations = "http://smartninja.betoo.si/api/eshop/orders";

    $scope.sendData = function() {
        var products = [];
        var basket = locker.get("basket");

        for(var c=0; c<basket.length; c++){
            products.push({
                id : basket[c].product.id,
                quantity : basket[c].quantity
            });
        }

        var data = {
            "firstName" : $scope.firstName,
            "lastName": $scope.lastName,
            "email" : $scope.email,
            "address" : $scope.address,
            "country" : $scope.country,
            "city": $scope.city,
            "zip": $scope.zip,
            "products": products,
            "date": $scope.date,
            "time" : $scope.time
        };

        $http.post(url_reservations, data).then (
            function(success) {
                locker.put("basket", []);
                alert("Your order has been sent.");
            },
            function(error) {
                alert("An error occured. Check all input fields.");
            }
        );
    };

/*

    $scope.sendData = function() {
        var products = [];
        var basket = locker.get("basket");


        for(var c=0; c<$rootScope.basket.length; c++){
            products.push({
                id : $rootScope.basket[c].product.id,
                quantity : $rootScope.basket[c].quantity
            });
        }

        var data = {
            "firstName" : $scope.firstName,
            "lastName": $scope.lastName,
            "email" : $scope.email,
            "address" : $scope.address,
            "country" : $scope.country,
            "city": $scope.city,
            "zip": $scope.zip,
            "products": products,
            "date": $scope.date,
            "time" : $scope.time
        };

        $http.post(url_reservations, data).then (
            function(success) {
                locker.put("basket", []);
                alert("Your order has been sent.");
            },
            function(error) {
                alert("An error occured. Check all input fields.");
            }
        );
    };
*/

    /* Datepicker */
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
});

/**
 * Created by polona on 15/05/16.
 */
angular.module('app').directive('appTimepicker', function(){
    return {
        restrict: 'E',
        controller: 'purchaseController',
        templateUrl: 'templates/purchase-form.html'
    };
});