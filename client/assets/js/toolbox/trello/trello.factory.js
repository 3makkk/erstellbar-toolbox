(function() {
    angular.module('tool.trello')
        .factory('TrelloFactory', TrelloFactory);

    TrelloFactory.$inject = ['TrelloApi', '$q'];

    function TrelloFactory(TrelloApi, $q) {

        var boardOptions = {
            idOrganization: null,
        };

        return {
            name: 'Trello',
            desc: 'Add new Trello Board',
            view: 'templates/service/trello-board.html',
            init: init,
            validateBoard: validateBoard,
            createBoard: createBoard
        };

        function init() {

            return TrelloApi.Authenticate()
                .then(loadOrganizations);

            function loadOrganizations() {
                return TrelloApi.Rest('GET', '/members/me/organizations');
            }
        }

        function validateBoard(organization, boardName) {
            return TrelloApi.Rest('GET', '/member/me/boards')
                .then(checkForBoard);


            function checkForBoard(boards) {
                var boardFound = false;
                var defferer = $q.defer();

                _.each(boards, function(board) {
                    if (board.name === boardName && board.idOrganization === organization) {
                        boardFound = true;
                    }
                });

                if (boardFound) {
                    defferer.reject('Board already exists');
                } else {
                    defferer.resolve();
                }

                return defferer.promise;
            }
        }

        function createBoard(selectedOrganization, boardname, boardDesc) {
            var boardConfig = boardOptions;
            boardConfig.name = boardname;
            boardConfig.desc = boardDesc;

            if (boardConfig.idOrganization === selectedOrganization.id) {
                delete boardConfig.idOrganization;
            } else {
                boardConfig.idOrganization = selectedOrganization.id;
                boardConfig.prefs_permissionLevel = 'org';
                boardConfig.prefs_invitations = 'members';
            }

            return TrelloApi.Rest('POST', '/boards', boardConfig);
        }
    }
})();
