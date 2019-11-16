class BinaryTree {

    // A node is composed with data, right, left

    constructor() {
        this.root = null;
    }

    /**
     * Insert new node inside the binary tree & return the new node inside of it
     * @param parentNode
     * @param nodeData
     * @returns {null}
     */
    insertNode(parentNode = null, nodeData) {
        let node = {
            data: nodeData.data,
            left: nodeData.left,
            right: nodeData.right
        };

        if (!parentNode) {
            this.root = node;
            return this.root;
        }

        if (!parentNode.left) { // insert new node to the left
            parentNode.left = node;
        } else if (!parentNode.right) {// insert new node to the right
            parentNode.right = node;
        } else { // parentNode is full
            console.log("ParentNode already have left & right node");
            return null;
        }
    }

    getRoot() {
        return this.root;
    }
}