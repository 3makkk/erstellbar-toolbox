/*(function() {
    'use strict';

    angular
        .module('app')
        .controller('UserController', UserController);

    UserController.$inject = ['$scope', 'Users'];

    function UserController($scope, Users) {
        var vm = this;

        vm.selectableUsersAvailable = Users.allUsersSelected();



        Users.setSelectableUsers($scope.selectableUsers);

        //$scope.$on(['users:select', 'users:unselect'], update);

        function update() {
            $scope.selectedUsers = Users.listSelectedUsers();
            $scope.selectableUsers = Users.listSelectableUsers();
            vm.selectableUsersAvailable = Users.allUsersSelected();
        }
    }
})();
*/