/**
 * Created by emak on 13.09.15.
 */
(function() {
    'use strict';
    angular.module('tool.dropbox', [
        'app.config',
        'toolbox',
        'dropbox'
    ])
        .config(config)
        .run(run);

    config.$inject = ['DropboxProvider', 'DROPBOX_APP_KEY', 'DROPBOX_REDIRECT_URI'];
    run.$inject = ['ToolBox', 'DropboxFactory'];

    function config(DropboxProvider, DROPBOX_APP_KEY, DROPBOX_REDIRECT_URI) {
        DropboxProvider.config(
            DROPBOX_APP_KEY,
            DROPBOX_REDIRECT_URI
        );
    }

    function run(ToolBox, DropboxFactory) {
        ToolBox.addTool(DropboxFactory);
    }

})();