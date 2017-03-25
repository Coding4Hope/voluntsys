var voluntsysApp = angular.module("voluntsysApp", ['ngSanitize', 'ui.select', 'ngCookies', 'ngProgress']);
voluntsysApp.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[').endSymbol(']}');
});

voluntsysApp.service("Ajax", function($http){
    return {
        request:function (method, url, data, callback_success, callback_error) {
            $http({
                method: method,
                data: data,
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                callback_success(response);
            }, function errorCallback(response) {
                callback_error(response);
            });
        }
    }
});