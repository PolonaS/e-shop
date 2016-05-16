angular.module('app').controller('indexController', function(locker) {
    if(locker.get("basket") == null)
        locker.put("basket", []);

    //$rootScope.basket = [];
});