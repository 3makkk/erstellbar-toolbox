(function() {
    'use strict';

    angular.module('toolbox')
        .controller('ToolController', ToolController);

    ToolController.$inject = ['$scope'];

    function ToolController($scope) {

        var vm = this;
        vm.lock = false;
        vm.error = false;
        vm.faIcon = '';
        vm.executed = false;

        vm.showLoadAnimation = true;

        $scope.$on('serviceError', function(e, res) {
            vm.error = true;
            vm.toolMessages = res.messages;
            vm.faIcon = 'fa-exclamation-triangle';
        });

        $scope.$on('serviceLoad', function() {
            vm.showLoadAnimation = false;
        });

        $scope.$on('checkTools', function(){
            vm.toolMessages = [];
            vm.faIcon = 'fag-cog fa-spin';
            console.log(vm.faIcon); 
        });

        $scope.$on('executeServices', function() {
            vm.faIcon = 'fa-cog fa-spin';
            vm.lock = true;
        });

        $scope.$on('serviceExecuted', function() {
            vm.faIcon = 'fa-check';
            vm.executed = true;
        });
    }
})();