/**
 * Created by emak on 13.09.15.
 */
(function () {

    'use strict';

    angular.module('tool.slack', [
        'toolbox',
        'slack'
    ])
        .config(config)
        .run(run);

    config.$inject = ['SlackProvider', 'SLACK_APP_KEY', 'SLACK_REDIRECT_URI', 'SLACK_APP_SECRET'];
    run.$inject = ['ToolBox', 'SlackChannelFactory', 'SlackPrivateChannelFactory', '$log'];

    function config(SlackProvider, SLACK_APP_KEY, SLACK_REDIRECT_URI, SLACK_APP_SECRET) {
        SlackProvider.config(
            SLACK_APP_KEY,
            SLACK_REDIRECT_URI,
            SLACK_APP_SECRET
        );
    }

    function run(ToolBox, SlackChannelFactory, SlackPrivateChannelFactory, $log) {
        $log.debug('Run Slack Module');
        ToolBox.addTool(SlackChannelFactory);
        ToolBox.addTool(SlackPrivateChannelFactory);
    }
})();