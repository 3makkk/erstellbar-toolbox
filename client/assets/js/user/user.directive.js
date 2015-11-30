(function() {
    'use strict';

    angular
        .module('app')
        .directive('users', User);

    User.$inject = ['UserService'];

    function User(UserService) {
        return {
            restrict: 'AE',
            templateUrl: 'templates/user/users.html',
            scope: {
                selectedUsers: '=ngSelectedUsers',
                selectableUsers: '=ngSelectableUsers',
            },

            link: function(scope) {
                scope.$watch('selectableUsers', function(newValue, oldValue, scope) {
                    UserService.setSelectalbeUsers(newValue);
                });
                
            },

            controller: ['$scope', function($scope) {
                $scope.select = select;
                $scope.unselect = unselect;

                function select(user) {
                    UserService.selectUser(user);
                    update();
                }

                function unselect(user) {
                    UserService.unselectUser(user);
                    update();
                }

                function update() {
                    $scope.selectedUsers = UserService.listSelectedUsers();
                    $scope.selectableUsers = UserService.listSelectableUsers();
                }
            }],

        };
    }
})();
