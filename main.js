class Node{
    constructor(value){
        this.data = value;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(arr){
        const processedArr = this.sortAndRemoveDuplicates(arr);
        this.root = this.buildTree(processedArr, 0, processedArr.length - 1);
    }

    sortAndRemoveDuplicates(arr){
        return [...new Set(arr)].sort((a, b) => a - b);
    }

    buildTree(arr, start, end){
        if(start > end){
            return null;
        }
        const mid = Math.floor((start + end)/2);
        const root = new Node(arr[mid]);

        root.left = this.buildTree(arr, start, mid -1);
        root.right = this.buildTree(arr, mid + 1, end);

        return root;
    }

    insert(value, node = this.root) {
        if (node === null) {
            return new Node(value);
        }
    
        if (value < node.data) {
            node.left = this.insert(value, node.left);
        } else if (value > node.data) {
            node.right = this.insert(value, node.right);
        }
    
        return node;
    }

    getSuccessor(curr) {
        curr = curr.right;
        while (curr !== null && curr.left !== null){
            curr = curr.left;
        }

        return curr;
    }
    
    deleteItem(value, node = this.root){
        if(node === null){
            return node;
        }

        if(node.data > value){
            node.left = this.deleteItem(value, node.left);
        } else if (node.data < value){
            node.right = this.deleteItem(value, node.right);
        } else {
            if(node.left === null){
                return node.right;
            } 
            if(node.right === null){
                return node.left;
            }

            const succ = this.getSuccessor(node);
            node.data = succ.data;
            node.right = this.deleteItem(succ.data, node.right);
        }

        return node;
    }

    find(value, node = this.root){
        if (node === null) return false;

        if (node.data === value) return true;

        if (value > node.data) return this.find(value, node.right);

        return this.find(value, node.left);
    }

    levelOrderForEach(callback, node = this.root){
        if(node == null){
            return;
        }
        let queue = [node];

        while(queue.length > 0){
            let current = queue.shift();
            callback(current);
            if(current.left !== null){
                queue.push(current.left)
            }
            if(current.right !== null){
                queue.push(current.right)
            }
        }
    }

    preOrderForEach(callback, node = this.root){
        if(node === null){
            return;
        }
        
        callback(node)
        this.preOrderForEach(callback, node.left);
        this.preOrderForEach(callback, node.right);

    }

    inOrderForEach(callback, node = this.root){
        if(node === null){
            return;
        }
        this.inOrderForEach(callback, node.left);
        callback(node);
        this.inOrderForEach(callback, node.right);
    }

    postOrderForEach(callback, node = this.root){
        if(node === null){
            return;
        }
        this.postOrderForEach(callback, node.left);
        this.postOrderForEach(callback, node.right);
        callback(node);
    }

    height(value, node = this.root){
       let height = { value: -1};

       this.findHeightUtil(node, value, height);
       return height.value;
    }

    findHeightUtil(node, value, height){
        if(!node){
            return -1;
        }

        let leftHeight = this.findHeightUtil(node.left, value, height);
        let rightHeight = this.findHeightUtil(node.right, value, height);

        let ans = Math.max(leftHeight, rightHeight) + 1;
        if(node.data === value){
            height.value = ans;
        }
        return ans;
    }
    
    depth(value, node = this.root){
        if (!node) {
            return -1;
        }
    
        let dist = -1;
    
        if (
            node.data === value ||
            (dist = this.depth(value, node.left)) >= 0 ||
            (dist = this.depth(value, node.right)) >= 0
        ) {
            return dist + 1;
        }
    
        return dist;
    }

    isBalanced(node = this.root){
        if (node === null) return true;

        const lHeight = this.findHeight(node.left);
        const rHeight = this.findHeight(node.right);
    
        if (Math.abs(lHeight - rHeight) > 1) return false;
    
        return this.isBalanced(node.left) && this.isBalanced(node.right);
    }
    findHeight(node) {
        if (node === null) return 0;
        return 1 + Math.max(this.findHeight(node.left), this.findHeight(node.right));
    }

    rebalance(){
        let values = [];

        this.inOrderForEach(node => values.push(node.data));

        this.root = this.buildTree(values, 0, values.length - 1);
    }

    


}

const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node === null) return;
    if (node.right !== null)
      prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null)
      prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
};
  

// const tree = new Tree([3, 1, 4, 1, 2, 5]);
// prettyPrint(tree.root);

function randomArray(size = 10) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
  }
  
  // --- DRIVER SCRIPT ---
  
  // 1️⃣ Create BST from random numbers
  const numbers = randomArray(10);
  console.log("Random numbers:", numbers);
  const tree = new Tree(numbers);
  
  // Pretty print initial tree
  console.log("\nInitial Tree:");
  prettyPrint(tree.root);
  
  // 2️⃣ Confirm tree is balanced
  console.log("\nIs tree balanced?", tree.isBalanced());
  
  // 3️⃣ Print all traversals
  console.log("\nLevel Order:");
  tree.levelOrderForEach(node => process.stdout.write(node.data + " "));
  
  console.log("\nPreorder:");
  tree.preOrderForEach(node => process.stdout.write(node.data + " "));
  
  console.log("\nInorder:");
  tree.inOrderForEach(node => process.stdout.write(node.data + " "));
  
  console.log("\nPostorder:");
  tree.postOrderForEach(node => process.stdout.write(node.data + " "));
  console.log("\n");
  
  // 4️⃣ Unbalance the tree by adding large numbers
  [150, 200, 250, 300, 400].forEach(num => tree.insert(num));
  
  console.log("\nTree after inserting large numbers:");
  prettyPrint(tree.root);
  
  // 5️⃣ Confirm unbalanced
  console.log("\nIs tree balanced after inserting large numbers?", tree.isBalanced());
  
  // 6️⃣ Rebalance the tree
  tree.rebalance();
  
  console.log("\nTree after rebalancing:");
  prettyPrint(tree.root);
  
  // 7️⃣ Confirm balanced again
  console.log("\nIs tree balanced after rebalancing?", tree.isBalanced());
  
  // 8️⃣ Print all traversals again
  console.log("\nLevel Order:");
  tree.levelOrderForEach(node => process.stdout.write(node.data + " "));
  
  console.log("\nPreorder:");
  tree.preOrderForEach(node => process.stdout.write(node.data + " "));
  
  console.log("\nInorder:");
  tree.inOrderForEach(node => process.stdout.write(node.data + " "));
  
  console.log("\nPostorder:");
  tree.postOrderForEach(node => process.stdout.write(node.data + " "));
  console.log("\n");