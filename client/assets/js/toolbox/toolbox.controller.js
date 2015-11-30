/**
 * Angular Toolbox Controller
 * @return {Object} Angular Controller
 */
(function () {
    angular.module('toolbox')
        .controller('ToolboxController', ToolboxController);

    ToolboxController.$inject = ['ToolBox', 'Slug', '$scope', '$window'];

    /**
     * Toolbox Controller
     * @param {Object} ToolBox Angular Toolbox Factory
     * @param {Object} Slug    Slugify Service
     * @param {Object} $scope  Angular scope
     * @param {Object} $window Angular window
     */
    function ToolboxController(ToolBox, Slug, $scope, $window) {

        /**
         * ViewModel
         * @type {Object}
         */
        var vm  = this;

        /**
         * Project Name
         * @type {String}
         */
        vm.name = null;

        /**
         * Project slug name
         * @type {String}
         */
        vm.slug = Slug.slugify(vm.name);
        
        /**
         * Project Description
         * @type {String}
         */
        vm.desc = null;

        /**
         * Stack of registered tools
         * @type {Array}
         */
        vm.registerStack = ToolBox.list();

        /**
         * Stack of added tools
         * @type {Array}
         */
        vm.configuredStack = [];
        
        /**
         * Stack of executed tools
         * @type {Array}
         */
        vm.executedStack = [];

        /**
         * Tool stack error flag
         * @type {Boolean}
         */
        vm.toolChainError = true;

        /**
         * Invalid config flag
         * 
         * Is true when something goes wrong on 
         * the configuration of a tool or the general project fields.
         * @type {Boolean}
         */
        vm.invalidConfig = true;

        /**
         * Lock Flag
         *
         * Locks execution of tool chain.
         * @type {Boolean}
         */
        vm.lock = false;

        /**
         * [executed tools count
         * @type {Number}
         */
        vm.executedCount = 0;

        vm.checkToolsCount = 0;

        /**
         * Move tool from one stack to an other.
         * 
         * @param  {Array} Source stack
         * @param  {Array} Target stack
         * @param  {Object} Element to move
         * @return {Array} Source
         */
        function moveElement(source, target, element) {
            source = _.without(source, element);
            target.push(element);

            return source;
        }

        $scope.$on('serviceLoad', function() {
            vm.toolChainError = false;
        });

        /**
         * Locks execution Button on execution
         */
        $scope.$on('executeServices', function() {
            vm.lock = true;
        });

        /**
         * Count executed Tools
         */
        $scope.$on('serviceExecuted', function() {
            vm.executedCount += 1;
        });

        /**
         * Listen to tool errors.
         * If there is a tool error set tool chain error flag
         */
        $scope.$on('serviceError', function() {
            if(vm.executedCount) {
                vm.toolChainError = true;
            }
        });

        $scope.$on('toolChecked', function(){
            vm.checkToolsCount += 1;
            if(vm.checkToolsCount === vm.configuredStack.length) {
                $scope.$broadcast('executeServices');
            }   
        });

        vm.checkTools = function() {
            vm.checkToolsCount = 0;
            $scope.$broadcast('checkTools');
        };

        /**
         * Move tool to configured tool stack
         * @param  {Object} element     tool to move
         */
        vm.moveToConfiguredStack = function(element) {
            vm.registerStack = moveElement(vm.registerStack, vm.configuredStack, element);
        };

        /**
         * Move tool to executed tool stack
         * @param  {Object} element     tool to move
         */
        vm.moveToExecutedStack = function(element) {
            vm.configuredStack = moveElement(vm.configuredStack, vm.executedStack, element);
        };

        /**
         * Remove tool to configured tool stack
         * @param  {Object} element     tool to move
         */
        vm.removeFromConfiguredStack = function(element) {
            vm.configuredStack = moveElement(vm.configuredStack, vm.registerStack, element);
            vm.toolChainError = (vm.configuredStack.length) ? false: true;
        };

        /**
         * Update project slug
         * 
         * @return {[type]} [description]
         */
        vm.updateProject = function() {
            vm.slug = Slug.slugify(vm.name);
            vm.invalidConfig = vm.name === '';
        };

        /**
         * Refresh hole page
         * @return {[type]} [description]
         */
        vm.refresh = function() {
            var result = $window.confirm('Are you shure you want to delete all configurations?');
            if(result === true) {
                $window.location.reload();
            }
        };
    }
})();
