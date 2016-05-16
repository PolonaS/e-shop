
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


