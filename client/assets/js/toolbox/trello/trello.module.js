/**
 * Created by emak on 13.09.15.
 */

(function() {
    'use strict';
    angular.module('tool.trello', [
        'toolbox',
        'trello',
        'app.config'
    ])
        .config(config)
        .run(run);

    config.$inject = ['TrelloApiProvider', 'TRELLO_APP_KEY', 'TRELLO_APP_SECRET'];
    run.$inject = ['ToolBox', 'TrelloFactory', '$log'];

    function config(TrelloApiProvider, TRELLO_APP_KEY, TRELLO_APP_SECRET) {
        TrelloApiProvider.init({
            key: TRELLO_APP_KEY,
            secret: TRELLO_APP_SECRET,
            scope: {read: true, write: true, account: true },
            name: 'Erstellbar ToolBox'
        });
    }

    function run(ToolBox, TrelloFactory, $log) {
        $log.debug('Run Trello Module');
        ToolBox.addTool(TrelloFactory);
    }

})();