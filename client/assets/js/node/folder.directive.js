(function() {
    'use strict';

    angular
        .module('app')
        .directive('folder', Folder);

    function Folder() {
        return {
            restrict: 'E',
            require: '^ngModel',
            templateUrl: 'templates/folder/folder-view.html',
            scope: {
                node: '=ngModel',
                asyncLoad: '=ngAsyncLoad'
            },
            controller: ['$scope', function($scope) {
                $scope.openFolder = function(node) {
                    $scope.asyncLoad(node);
                };
            }],
        };
    }

})();
