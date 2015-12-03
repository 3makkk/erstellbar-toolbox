(function() {
     angular.module('tool.slack')
         .controller('SlackChannelController', SlackChannelController);

     SlackChannelController.$inject = ['$scope', 'SlackChannelFactory'];

     function SlackChannelController($scope, SlackChannelFactory) {

         var vm = this;
         vm.invited = [];
         vm.channelName = $scope.toolbox.slug;
         vm.channelPurpose = $scope.toolbox.desc;
         vm.setSelectableUsers = [];
         vm.selectedUsers = [];

         $scope.$on('checkTools', checkTools);
         $scope.$on('executeServices', executeServices);
         $scope.$watch('toolbox.slug', function(slug) {
             vm.channelName = slug;
         });
         $scope.$watch('toolbox.desc', function(desc) {
             vm.channelPurpose = desc;
         });


         init();

         function init() {
             SlackChannelFactory.init()
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
             SlackChannelFactory.validateChannelName(vm.channelName)
                 .then(success, fail);

             function success() {
                 $scope.$emit('toolChecked');
             }

             function fail() {
                 $scope.$emit('serviceError', 'Channel already exists');
             }
         }

         function executeServices() {

             SlackChannelFactory.createChannel(vm.channelName, vm.selectedUsers, vm.channelPurpose)
                 .then(success, error);

             function success() {
                 $scope.$emit('serviceExecuted');
             }

             function error() {
                 $scope.$emit('serviceError', {
                     messages: ['Channel can\'t be created. Please try again later.']
                 });
             }
         }
     }
 })();
