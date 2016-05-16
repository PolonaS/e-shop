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