(function() {
    'use strict';

    angular.module('tool.google-drive')
        .controller('GoogleDriveController', GoogleDriveController);

    GoogleDriveController.$inject = ['$scope', 'GoogleDriveFactory', 'JSTagsCollection'];

    function GoogleDriveController($scope, GoogleDriveFactory, JSTagsCollection) {

        var vm = this;

        vm.folderName = $scope.toolbox.slug;
        vm.desc = $scope.toolbox.desc;
        vm.rootNode = null;
        vm.enterFolder = enterFolder;
        vm.userTags = new JSTagsCollection();
        vm.jsTagOptions = {
            tags: vm.userTags,
            texts: {
                inputPlaceHolder: 'user@provider.com'
            },
        };


        $scope.$on('checkTools', checkTools);
        $scope.$on('executeServices', executeServices);
        $scope.$watch('toolbox.slug', function(toolboxSlug) {
            vm.folderName = toolboxSlug;
        });
        $scope.$watch('toolbox.desc', function(desc) {
            vm.desc = desc;
        });

        init();

        function init() {
            GoogleDriveFactory.init()
                .then(bindVm)
                .then(function() {
                    $scope.$emit('serviceLoad');
                })
                .catch(authFail);

            function authFail(result) {
                $scope.$emit('serviceError', {
                    messages: [result]
                });
            }
        }

        function enterFolder(node) {
            GoogleDriveFactory.loadChildNodes(node)
                .then(bindVm);
        }

        function bindVm(rootNode) {
            console.log(rootNode);
            vm.rootNode = rootNode;
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
            GoogleDriveFactory.createFolder(vm.rootNode, vm.folderName, vm.userTags.tags)
                .then(folderCreated, creationFailed);

            function folderCreated(fileResult) {
                $scope.$emit('serviceExecuted');
            }

            function creationFailed(result) {
                $scope.$emit('serviceError', {
                    messages: [result]
                });
            }
        }
    }
})();
