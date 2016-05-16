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