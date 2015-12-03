(function() {
    'use strict';

    var app = angular.module('tool.google-drive', [
        'toolbox',
        'gapi',
        'jsTag'
    ])
        .config(config)
        .run(run);


    run.$inject = ['ToolBox','GoogleDriveFactory' , '$log'];

    function config() {
    }

    function run(ToolBox, GoogleDriveFactory, $log) {
        $log.debug('Run Google Drive Module');
        ToolBox.addTool(GoogleDriveFactory);
    }
})();