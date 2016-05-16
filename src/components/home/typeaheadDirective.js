angular.module('app').directive('appTypeahead', function(){
    return {
        restrict: 'E',
        controller: 'homeController',
        templateUrl: 'templates/typeahead-template.html'
    };
});