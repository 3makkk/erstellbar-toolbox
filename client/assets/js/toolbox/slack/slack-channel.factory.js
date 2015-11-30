(function() {
    angular.module('tool.slack')
        .factory('SlackChannelFactory', SlackChannelFactory);

    SlackChannelFactory.$inject = ['Slack', '$q'];

    function SlackChannelFactory(Slack, $q) {

        var errorMessages = {
            chooseOtherName: 'Choose other name or remove this service.',
            invalidChannelName: 'Group %s already exists.',
            channelArchived: 'Group %s is archieved.',
        };

        return {
            name: 'Slack Channel',
            desc: 'Add new Slack Channel',
            view: 'templates/service/slack-channel.html',
            init: init,
            validateChannelName: validateChannelName,
            createChannel: createChannel
        };

        function init() {
            return Slack.authenticate({
                    scope: 'read,post'
                })
                .then(loadUsers);

            function loadUsers() {
                return Slack.users.list();
            }
        }

        function validateChannelName(channelName) {
            return Slack.channels.list()
                .then(findChannel);

            function findChannel(response) {

                var defferer = $q.defer();
                var channelNameAvailable = true;
                var messages = [];

                _.each(response.channels, function(channel) {
                    if (channel.name === channelName) {
                        if (true === channel.is_archived) {
                            messages.push(errorMessages.channelArchived);
                        } else {
                            messages.push(errorMessages.invalidChannelName);
                        }
                        messages.push(errorMessages.chooseOtherName);
                        $q.reject(messages);
                        channelNameAvailable = false;
                    }
                });

                if (true === channelNameAvailable) {
                    defferer.resolve();
                }

                return defferer.promise;
            }
        }

        function createChannel(channelName, users, channelPurpose) {

            var defferer = $q.defer();
            var i = 0;

            return Slack.channels.create(channelName)
                .then(inviteMember);

            function inviteMember(res) {
                Slack.channels.setPurpose(res.channel.id, channelPurpose);
                _.each(users, function(user) {
                    Slack.channels.invite(res.channel.id, user.id)
                        .then(check);
                });

                function check() {
                    if (users.length === i++) {
                        defferer.resolve(res);
                    }
                }
            }

            return defferer.promise;
        }
    }
})();
