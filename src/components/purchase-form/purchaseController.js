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
