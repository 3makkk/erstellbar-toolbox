function Node(value, id) {

    this.value = value;
    this.id = id;
    this.children = [];
    this.parent = null;
    this.root = false;

    this.setParentNode = function(node) {
        this.parent = node;
    };

    this.getParentNode = function() {
        return this.parent;
    };

    this.addChild = function(node) {
        node.setParentNode(this);
        this.children[this.children.length] = node;
    };

    this.getChildren = function() {
        return this.children;
    };

    this.hasChildNodes = function() {
        return Boolean(this.children.length);
    };

    this.removeChildren = function() {
        this.children = [];
    };

    this.containsNodeWithValue = function(value) {
        var foundFolders = _.find(this.children, function(node) {
            return (node.value === value);
        });

        return (foundFolders !== undefined);
    };

    this.getPath = function(folderName) {
        var pathSegments = [];
        getPathSegment(this);

        function getPathSegment(node) {
            if (!node.root) {
                pathSegments.push(node.value);
            }
            var parent = node.getParentNode();
            if (parent) {
                getPathSegment(parent);
            }
        }
        pathSegments = pathSegments.reverse();

        if (folderName !== undefined || folderName === null) {
            pathSegments.push(folderName);
        }
        var path = pathSegments.join('/');

        return path;
    };
}
