/**
 * Trello Service Controller
 *
 * Control Trello Board Box
 *
 * @package trelloService
 * @author Sven Friedemann <sven@erstellbar.de>
 * @licence MIT <https://opensource.org/licenses/MIT>
 */
(function() {
    'use strict';

    angular.module('tool.trello')
        .controller('TrelloController', TrelloController);

    TrelloController.$inject = ['$scope', 'TrelloFactory'];

    function TrelloController($scope, TrelloFactory) {

        var vm = this;


        vm.boardName = $scope.toolbox.name;
        vm.boardDesc = $scope.toolbox.desc;
        vm.selectedOrganization = null;

        $scope.$on('checkTools', checkTools);
        $scope.$on('executeServices', executeServices);

        $scope.$watch('toolbox.name', function(name) {
            vm.boardName = name;
        });
        $scope.$watch('toolbox.desc', function(desc) {
            vm.boardDesc = desc;
        });

        init();

        function init() {
            TrelloFactory.init()
                .then(bindOrganizations)
                .then(loadedComplete)
                .catch(fail);


            function bindOrganizations(organizations) {
                vm.organizations = organizations;
            }

            function loadedComplete() {
                $scope.$emit('serviceLoad');
            }

            function fail() {
                $scope.$emit('serviceError', {
                    'messages': ['Organizations can\'t be loaded.']
                });
            }
        }

        function checkTools() {

            TrelloFactory.validateBoard()
                .then(success, fail);

            function success() {
                $scope.$emit('toolChecked');
            }

            function fail(response) {
                $scope.$emit('serviceError', {
                    messages: [response]
                });
            }
        }

        function executeServices() {

            TrelloFactory.createBoard(vm.selectedOrganization, vm.boardName, vm.boardDesc)
                .then(boardCreated, fail);

            function boardCreated() {
                $scope.$emit('serviceExecuted');
            }

            function fail() {
                $scope.$emit('serviceError', {
                    'messages': ['Board can\'t be created. Please try again later.']
                });
            }
        }

    }
})();
