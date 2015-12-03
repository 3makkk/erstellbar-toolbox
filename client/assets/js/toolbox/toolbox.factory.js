(function() {
    angular.module('toolbox')
        .factory('ToolBox', ToolBox);

    function ToolBox() {

        var serviceStack = [];

        return {
            addTool: function(service) {
                if (_.contains(serviceStack, service) === false) {
                    serviceStack.push(service);
                }
            },

            removeTool: function(service) {
                _.without(serviceStack, service);
            },

            count: function() {
                return serviceStack.count();
            },

            list: function() {
                return serviceStack;
            }
        };
    }
})();
