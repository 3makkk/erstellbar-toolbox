(function() {
    'use strict';

    var app = angular.module('tool.google-drive', [
        'toolbox',
        'gapi'
    ])
        .config(config)
        .run(run)
        .value('GoogleApp', {
            apiKey: 'fpVj4ZT87Jj6WlYOd_E7PV5M',
            clientId: '311425043160-j4gn18r1n4lq926dn23hr3guupmolt2q.apps.googleusercontent.com',
            scopes: [
              'https://www.googleapis.com/auth/drive',
            ]
          });

    run.$inject = ['ToolBox','GoogleDriveFactory' , '$log'];

    function config() {
    }

    function run(ToolBox, GoogleDriveFactory, $log) {
        $log.debug('Run Google Drive Module');
        ToolBox.addTool(GoogleDriveFactory);
    }
})();