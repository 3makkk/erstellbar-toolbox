(function() {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

       UserService.$inject = ['$rootScope'];

    function UserService($rootScope) {

        var selectableUsers = [];
        var selectedUsers = [];

        var service = {
            setSelectalbeUsers: setSelectalbeUsers,
            addSelectableUser: addSelectableUser,

            selectUser: selectUser,
            unselectUser: unselectUser,
            allUsersSelected: allUsersSelected,

            listSelectableUsers: listSelectableUsers,
            listSelectedUsers: listSelectedUsers
        };

        return service;

        function setSelectalbeUsers(users) {
            selectableUsers = users;
        }

        function addSelectableUser(user) {
            selectableUsers.push(user);
        }

        function selectUser(user) {
            selectedUsers.push(user);
            selectableUsers = _.without(selectableUsers, user);
        }

        function unselectUser(user) {
            selectedUsers = _.without(selectedUsers, user);
            selectableUsers.push(user);
        }

        function allUsersSelected() {
        	var allUsersSelectedBool = Boolean(selectableUsers.length);

        	return allUsersSelectedBool;
        }

        function listSelectedUsers() {
            return selectedUsers;
        }

        function listSelectableUsers() {
            return selectableUsers;
        }

        function listAllUsers() {
            return selectedUsers.concat(selectableUsers);
        }
    }
})();
