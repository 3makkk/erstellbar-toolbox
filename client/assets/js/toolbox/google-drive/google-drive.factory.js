(function() {
    'use strict';
    angular
        .module('tool.google-drive')
        .factory('GoogleDriveFactory', GoogleDrive);

    GoogleDrive.$inject = ['Drive', 'GAPI', '$q'];

    function GoogleDrive(Drive, GAPI, $q) {

        var mimeType = 'application/vnd.google-apps.folder';
        var driveOptions = {
            q: 'mimeType = \'' + mimeType + '\' and trashed = false'
        };

        return {
            name: 'Google Drive',
            desc: 'Add new Google Drive folder',
            view: 'templates/service/google-drive.html',
            init: init,
            loadRootFolder: loadRootFolder,
            loadChildNodes: loadChildNodes,
            createFolder: createFolder,
        };

        function init() {
            return GAPI.init()
                .then(loadRootFolder);
        }

        function loadRootFolder() {
            return Drive.getFiles('root')
                .then(listRoot);

            function listRoot(result) {
                var node = new Node(result.title, result.id);

                return loadChildNodes(node);
            }
        }

        /**
         * Load Folder childs and add parent
         * 
         * @param  {Node} result  Result of Api Call
         */
        function loadChildNodes(node) {
            var deffered = $q.defer();

            if (node.hasChildNodes()) {
                deffered.resolve(node);
            } else {
                Drive.listChildren(node.id, driveOptions).then(addChildNodes);
            }

            function addChildNodes(result) {
                var i = 0;

                if (result.items.length > 0) {
                    // Load meta info for each getFiles
                    _.each(result.items, function(item) {
                        Drive.getFiles(item.id)
                        .then(addToTree, fail);
                    });
                } else {
                    deffered.resolve(node);
                }

                function addToTree(nodeInfo) {
                    i++;
                    var childNode = new Node(nodeInfo.title, nodeInfo.id);
                    node.addChild(childNode);

                    if (i === result.items.length) {
                        deffered.resolve(node);
                    }
                }

                function fail(response) {
                    deffered.reject(response);
                }
            }

            return deffered.promise;
        }

        function createFolder(rootNode, folderName) {
            var newFolder = {
                title: folderName,
                mimeType: mimeType,
                parents: [{
                    id: rootNode.id
                }]
            };

            return Drive.insertFiles(newFolder);
        }
    }
})();
