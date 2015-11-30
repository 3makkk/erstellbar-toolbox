(function() {
    angular.module('tool.slack')
        .controller('SlackPrivateChannelController', SlackPrivateChannelController);

    SlackPrivateChannelController.$inject = ['$scope', 'SlackPrivateChannelFactory'];

    function SlackPrivateChannelController($scope, SlackPrivateChannelFactory) {

        var vm = this;

        vm.privateChannelName = $scope.toolbox.slug;
        vm.channelPurpose = $scope.toolbox.desc;
        vm.selectedUsers = [];
        vm.selectableUsers = [];

        $scope.$on('checkTools', checkTools);
        $scope.$on('executeServices', executeServices);
        $scope.$watch('toolbox.slug', function(slug) {vm.privateChannelName = slug;});
        $scope.$watch('toolbox.desc', function(desc) {vm.channelPurpose = desc;});

        init();

        function init() {
            SlackPrivateChannelFactory.init()
                .then(bindToSelectable)
                .then(loadComplete)
                .catch(authFailed);

            function bindToSelectable(users) {
                vm.selectableUsers = users.members;
            }

            function loadComplete() {
                $scope.$emit('serviceLoad');
            }

            function authFailed() {
                $scope.$emit('serviceError', {
                    messages: ['Authentication failed.']
                });
            }
        }

        function checkTools() {
            SlackPrivateChannelFactory.validatePrivateChannelName(vm.channelName)
                .then(success, fail);

            function success() {
                $scope.$emit('toolChecked');
            }

            function fail() {
                $scope.$emit('serviceError', 'Channel already exists');
            }
        }

        function executeServices() {

            SlackPrivateChannelFactory.createPrivateChannel(vm.channelName, vm.selectedUsers, vm.channelPurpose)
                .then(success, error);

            function success() {
                $scope.$emit('serviceExecuted');
            }

            function error() {
                $scope.$emit('serviceError', {
                    messages: ['Private channel can\'t be created. Please try again later.']
                });
            }
        }
    }
})();
