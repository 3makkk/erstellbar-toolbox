(function() {
    'use strict';

    angular.module('tool.dropbox')
        .controller('DropboxController', DropboxController);

    DropboxController.$inject = ['$scope', 'DropboxFactory'];

    function DropboxController($scope, DropboxFactory) {

        var vm = this;

        vm.folderName = $scope.toolbox.slug;
        vm.rootNode = null;
        vm.enterFolder = enterFolder;

        $scope.$watch('toolbox.slug', function(slug) {vm.folderName = slug;});
        $scope.$on('checkTools', checkTools);
        $scope.$on('executeServices', executeServices);


        init();

        function init() {
            DropboxFactory.init()
                .then(bindToVM)
                .then(function() {$scope.$emit('serviceLoad');})
                .catch(authFailed);

            function authFailed() {
                $scope.$emit('serviceError', {
                    messages: ['Authentication failed.']
                });
            }
        }

        function enterFolder(node) {
            DropboxFactory.loadChildNodes(node)
                .then(bindToVM);
        }

        function bindToVM(node) {
            vm.rootNode = node;
        }

        function checkTools() {
            if (vm.rootNode.containsNodeWithValue(vm.folderName) !== true) {
                $scope.$emit('toolChecked');
            } else {
                $scope.$emit('serviceError', {
                    messages: ['Folder already exists.']
                });
            }
        }

        function executeServices() {

            DropboxFactory.createFolder(vm.rootNode, vm.folderName)
                .then(success)
                .catch(error);

            function success() {
                $scope.$emit('serviceExecuted');
            }

            function error(result) {
                $scope.$emit('serviceError', {
                    messages: ['Folder can\'t be created. Please try again later.']
                });
            }
        }

    }

})();
