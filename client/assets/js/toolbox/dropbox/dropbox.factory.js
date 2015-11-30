(function() {
    'use strict';

    angular.module('tool.dropbox')
        .factory('DropboxFactory', DropboxServiceFactory);

    DropboxServiceFactory.$inject = ['Dropbox', '$q'];

    function DropboxServiceFactory(Dropbox, $q) {

        return {
            name: 'Dropbox',
            desc: 'Add new Dropbox Folder',
            view: 'templates/service/dropbox-folder.html',
            init: init,
            loadRootFolder: loadRootFolder,
            loadChildNodes: loadChildNodes,
            validateFolder: validateFolder,
            createFolder: createFolder
        };

        function init() {
            return Dropbox.authenticate()
                .then(loadRootFolder);
        }

        function loadRootFolder() {
            var node = new Node('/', '/');
            node.root = true;

            return loadChildNodes(node);
        }

        function loadChildNodes(node) {

            var deffered = $q.defer();

            if (node.hasChildNodes()) {
                deffered.resolve(node);
            } else {
                Dropbox.metadata(node.id, {
                        list: true
                    })
                    .then(listFolderContent)
                    .catch(listFail);
            }

            function listFolderContent(dropboxNode) {
                _.each(dropboxNode.contents, function(content) {
                    if (content.is_dir) {
                        var name = content.path.substr(content.path.lastIndexOf('/') + 1);
                        var childNode = new Node(name, content.path);
                        node.addChild(childNode);
                    }
                });

                deffered.resolve(node);
            }

            function listFail() {
                deffered.reject('Folder can\'t be accessed.');
            }

            return deffered.promise;
        }

        function validateFolder(rootNode, folderName) {
            Dropbox.search(rootNode.getPath(), folderName)
                .then(checkFolder);

            function checkFolder(seachResults) {
                var deffered = $q.deffered();

                if (seachResults.length === 0) {
                    deffered.resolve();
                } else {
                    deffered.reject('Folder already exists.');
                }

                return deffered.promise;
            }
        }

        function createFolder(rootNode, folderName) {
            return Dropbox.mkdir('/' + rootNode.getPath(folderName));
        }
    }
})();
