(function() {
    angular
        .module('tool.slack')
        .factory('SlackPrivateChannelFactory', SlackPrivateChannelFactory);

    SlackPrivateChannelFactory.$inject = ['Slack', '$q'];

    function SlackPrivateChannelFactory(Slack, $q) {

        var errorMessages = {
            chooseOtherName: 'Choose other name or remove this service.',
            invalidGroupName: 'Private channel %s already exists.',
            groupArchived: 'Private channel %s is archieved.',
        };

        return {
            name: 'Slack Private Group',
            desc: 'Add new private Slack group',
            view: 'templates/service/slack-private-group.html',
            init: init,
            validatePrivateChannelName: validatePrivateChannelName,
            createPrivateChannel: createPrivateChannel
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

        function validatePrivateChannelName(privateChannelName) {
            return Slack.groups.list()
                .then(findprivateChannel);

            function findprivateChannel(response) {

                var defferer = $q.defer();
                var privateChannelNameAvailable = true;
                var messages = [];

                _.each(response.groups, function(privateChannel) {
                    if (privateChannel.name === privateChannelName) {
                        if (true === privateChannel.is_archived) {
                            messages.push(errorMessages.privateChannelArchived);
                        } else {
                            messages.push(errorMessages.invalidprivateChannelName);
                        }
                        messages.push(errorMessages.chooseOtherName);
                        $q.reject(messages);
                        privateChannelNameAvailable = false;
                    }
                });

                if (true === privateChannelNameAvailable) {
                    defferer.resolve();
                }

                return defferer.promise;
            }
        }

        function createPrivateChannel(privateChannelName, users, privateChannelPurpose) {

            var defferer = $q.defer();
            var i = 0;

            return Slack.groups.create(privateChannelName)
                .then(inviteMember);

            function inviteMember(res) {
                Slack.groups.setPurpose(res.group.id, privateChannelPurpose);
                _.each(users, function(user) {
                    Slack.groups.invite(res.group.id, user.id)
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
