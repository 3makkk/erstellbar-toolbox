(function() {
    angular.module('toolbox')
        .controller('ToolboxController', ToolboxController);

    ToolboxController.$inject = ['ToolBox', 'Slug', '$scope', '$window'];

    function ToolboxController(ToolBox, Slug, $scope, $window) {


        var vm = this;

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

        vm.executedCount = 0;

        vm.checkToolsCount = 0;

        vm.checkTools = checkTools;

        vm.moveToConfiguredStack = moveToConfiguredStack;

        vm.moveToExecutedStack = moveToExecutedStack;

        vm.removeFromConfiguredStack = removeFromConfiguredStack;

        vm.updateProject = updateProject;
        
        vm.refresh = refresh;


        $scope.$on('serviceError', serviceError);
        $scope.$on('toolChecked', toolChecked);

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
        function serviceError() {
            if (vm.executedCount) {
                vm.toolChainError = true;
            }
        }

        function toolChecked() {
            vm.checkToolsCount += 1;
            if (vm.checkToolsCount === vm.configuredStack.length) {
                $scope.$broadcast('executeServices');
            }
        }

        function checkTools() {
            vm.checkToolsCount = 0;
            $scope.$broadcast('checkTools');
        }

        /**
         * Move tool to configured tool stack
         * @param  {Object} element     tool to move
         */
        function moveToConfiguredStack(element) {
            vm.registerStack = moveElement(vm.registerStack, vm.configuredStack, element);
        }

        /**
         * Move tool to executed tool stack
         * @param  {Object} element     tool to move
         */
        function moveToExecutedStack(element) {
            vm.configuredStack = moveElement(vm.configuredStack, vm.executedStack, element);
        }

        /**
         * Remove tool to configured tool stack
         * @param  {Object} element     tool to move
         */
        function removeFromConfiguredStack(element) {
            vm.configuredStack = moveElement(vm.configuredStack, vm.registerStack, element);
            vm.toolChainError = (vm.configuredStack.length) ? false : true;
        }

        /**
         * Update project slug
         * 
         * @return {[type]} [description]
         */
        function updateProject() {
            vm.slug = Slug.slugify(vm.name);
            vm.invalidConfig = vm.name === '';
        }

        /**
         * Refresh hole page
         * @return {[type]} [description]
         */
        function refresh() {
            var result = $window.confirm('Are you shure you want to delete all configurations?');
            if (result === true) {
                $window.location.reload();
            }
        }

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
    }
})();
