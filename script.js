let firstOrder = -1;
let secondOrder = -1;
let toGuess = -1;
let winStreak = 0;
let bestWinStreak = 0;
let numQuestions = 0;
let numCorrect = 0;
let traversalNames = ["Pre", "Post", "In", "Level"];
let traversals = [];
let treeDiagram = "";

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinaryTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        var newNode = new Node(value);
        if (this.root === null) {
            this.root = newNode;
            return this;
        }

        let current = this.root;
        while (current) {
            if (Math.floor(Math.random() * 2) === 0) {
                if (current.left === null) {
                    current.left = newNode;
                    return this;
                }
                current = current.left;
            } else {
                if (current.right === null) {
                    current.right = newNode;
                    return this;
                }
                current = current.right;
            }
        }
    }

    preOrderHelper(list, curr) {
        if (curr === null) {
            return;
        }
        list.push(curr.value);
        this.preOrderHelper(list, curr.left);
        this.preOrderHelper(list, curr.right);
    }

    postOrderHelper(list, curr) {
        if (curr === null) {
            return;
        }
        this.postOrderHelper(list, curr.left);
        this.postOrderHelper(list, curr.right);
        list.push(curr.value);
    }

    inOrderHelper(list, curr) {
        if (curr === null) {
            return;
        }
        this.inOrderHelper(list, curr.left);
        list.push(curr.value);
        this.inOrderHelper(list, curr.right);
    }

    preOrder() {
        let preOrder = [];
        this.preOrderHelper(preOrder, this.root);
        return preOrder;
    }

    postOrder() {
        let postOrder = [];
        this.postOrderHelper(postOrder, this.root);
        return postOrder;
    }

    inOrder() {
        let inOrder = [];
        this.inOrderHelper(inOrder, this.root);
        return inOrder;
    }

    levelOrder() {
        let levelOrder = [];
        let q = [this.root];
        for (let i = 0; i < q.length; ++i) {
            if (q[i] === null) {
                continue;
            }
            levelOrder.push(q[i].value);
            q.push(q[i].left);
            q.push(q[i].right);
        }
        return levelOrder;
    }

    // This code was basically just used from the 281 lab 8 print_diagram() function for AVL Trees
    getDiagram() {
        const points = [];

        const traverseDepth = (node, p) => {
            if (node === null) {
                return;
            }
            traverseDepth(node.left, { depth: p.depth + 1, parentDir: 1 });
            points.push({ value: node.value, pos: p });
            traverseDepth(node.right, { depth: p.depth + 1, parentDir: -1 });
        };

        traverseDepth(this.root, { depth: 0, parentDir: 0 });

        let width = 2 * points.length;
        let height = 0;
        points.forEach(point => {
            height = Math.max(height, point.pos.depth);
        });
        height = height * 2 + 1;

        const buffer = Array.from({ length: width }, () => Array(height).fill(' '));

        points.forEach((point, i) => {
            const n = point.value;
            const d = point.pos.depth;
            buffer[2 * i + 1][d * 2] = String(n % 10);
            if (n >= 10) {
                buffer[2 * i][d * 2] = String(Math.floor((n / 10) % 10));
            }
        });

        points.forEach((point, i) => {
            const d = point.pos.depth;
            const dir = point.pos.parentDir;
            if (dir === 0) {
                return;
            }

            let targetIndex = i + dir;
            if (targetIndex >= 0 && targetIndex < points.length && points[targetIndex].pos.depth === d - 1) {
                buffer[2 * i + (dir > 0 ? 2 : 0)][d * 2 - 1] = dir > 0 ? '/ ' : '\\ ';
            }
            else {
                const start = 2 * i + (dir > 0 ? 2 : -1);
                buffer[start][d * 2 - 1] = dir > 0 ? '/ ' : '\\ ';
                buffer[start + dir][d * 2 - 2] = '.';
                for (let j = i + 2 * dir; points[j] && points[j].pos.depth !== d - 1; j += dir) {
                    buffer[2 * j][d * 2 - 2] = '.';
                    buffer[2 * j + 1][d * 2 - 2] = '.';
                }
            }
        });

        let total = "";
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                total += buffer[x][y];
            }
            total += "\n";
        }
        return total;
    }

}

function generateTree() {
    let bTree = new BinaryTree();
    let l = [];
    for (let i = 0; i < 8; ++i) {
        let val = Math.floor(Math.random() * 100);
        while (l.includes(val)) {
            val = Math.floor(Math.random() * 100);
        }
        l.push(val);
    }
    l.forEach((elem) => bTree.insert(elem));
    let post = bTree.postOrder();
    let pre = bTree.preOrder();
    let ino = bTree.inOrder();
    let lev = bTree.levelOrder();
    treeDiagram = bTree.getDiagram();
    return [pre, post, ino, lev];
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        if (document.getElementById('answer-selection').style.display === "block") {
            checkAnswer();
        }
        else {
            tryAgain();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('total-questions').innerText = `Questions Attempted: ${numQuestions}`;
    document.getElementById('accuracy').innerText = `Accuracy: 0.00%`;
    document.getElementById('win-streak').innerText = `Current Win Streak: ${winStreak}`;
    document.getElementById('best-win-streak').innerText = `Best Win Streak: ${bestWinStreak}`;
    document.getElementById('answer-container').classList.add('hidden');
    const toggleBtn = document.getElementById('toggleBtn');
    const body = document.body;

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const mode = body.classList.contains('light-mode') ? 'light' : 'dark';
        toggleBtn.innerHTML = `<img src="moon_${mode.toLowerCase()}.png" alt="Moon">`;

    });

    document.getElementById('continue-button').addEventListener('click', () => {
        start();
    });

    document.getElementById('user-input').addEventListener('keypress', handleKeyPress);

    document.getElementById('try-again-user-input').addEventListener('keypress', handleKeyPress);

    start();

});

function start() {
    document.getElementById('answer-container').style.display = "none";
    document.getElementById('answer-selection').style.display = "block";
    document.getElementById('solution').innerText = "";
    document.getElementById('try-again-user-input').value = "";
    firstOrder = Math.floor(Math.random() * 4);
    if (firstOrder <= 1) {
        secondOrder = Math.floor((Math.random() * 2) + 2);
    }
    else {
        secondOrder = Math.floor(Math.random() * 2);
    }
    toGuess = secondOrder;
    while (toGuess === secondOrder || toGuess === firstOrder) {
        toGuess = Math.floor(Math.random() * 4);
    }
    traversals = generateTree();
    document.getElementById('pptraversal').innerText = traversalNames[firstOrder] + "order Traversal: " + (traversals[firstOrder].join(', '));
    document.getElementById('inorder').innerText = traversalNames[secondOrder] + "order Traversal: " + traversals[secondOrder].join(', ');
    document.getElementById('give-the-blank-order-traversal').innerText = `Give the ${traversalNames[toGuess]}order traversal as a comma-separated list:`;
    document.getElementById('tree-diagram').innerText = "";
}

function checkAnswer() {
    ++numQuestions;
    let userAnswer = document.getElementById('user-input').value.trim();
    userAnswer = userAnswer.replace(/ |[\[{()}\]]/g, "");
    if (JSON.stringify(userAnswer) === JSON.stringify(traversals[toGuess].join(','))) {
        document.getElementById('answer-container').style.display = "block";
        document.getElementById('answer-selection').style.display = "none";
        document.getElementById('try-again-user-input').style.display = "none";
        document.getElementById('try-again-button').style.display = "none";
        document.getElementById('solution').style.color = "#0fa328";
        document.getElementById('solution').innerText = winStreak < 100 ? `Correct (Answer: ${traversals[toGuess].join(', ')})` : 'STD Wizard! (Merlinius, is that you?)';
        document.getElementById('tree-diagram').innerText = treeDiagram;
        document.getElementById('show-answer-container').style.display = "none";
        document.getElementById('show-tree-container').style.display = "none";
        numCorrect++;
        winStreak++;
        bestWinStreak = Math.max(winStreak, bestWinStreak);
    }
    else {
        document.getElementById('answer-container').style.display = "block";
        document.getElementById('answer-selection').style.display = "none";
        document.getElementById('solution').style.color = "#ff2f2f";
        document.getElementById('solution').innerText = `Incorrect ${traversalNames[toGuess]}order Traversal`;
        document.getElementById('try-again-user-input').style.display = "block";
        document.getElementById('try-again-button').style.display = "block";
        document.getElementById('continue-button-container').style.display = "none";
        document.getElementById('show-answer-container').style.display = "block";
        document.getElementById('show-tree-container').style.display = "block";
        document.getElementById('tree-diagram-header').style.display = "none";
        winStreak = 0;
    }

    document.getElementById('total-questions').innerText = `Questions Attempted: ${numQuestions}`;
    document.getElementById('accuracy').innerText = `Accuracy: ${(parseFloat(numCorrect) / parseFloat(numQuestions) * 100).toFixed(2)}%`;
    document.getElementById('win-streak').innerText = `Current Win Streak: ${winStreak}`;
    document.getElementById('best-win-streak').innerText = `Best Win Streak: ${bestWinStreak}`;
    document.getElementById('user-input').value = "";
}

function tryAgain() {
    let userAnswer = document.getElementById('try-again-user-input').value.trim();
    userAnswer = userAnswer.replace(/ |[\[{()}\]]/g, "");
    if (JSON.stringify(userAnswer) === JSON.stringify(traversals[toGuess].join(','))) {
        document.getElementById('answer-container').style.display = "block";
        document.getElementById('answer-selection').style.display = "none";
        document.getElementById('try-again-user-input').style.display = "none";
        document.getElementById('try-again-button').style.display = "none";
        document.getElementById('solution').style.color = "#0fa328";
        document.getElementById('solution').innerText = `Correct (Answer: ${traversals[toGuess].join(', ')})`;
        document.getElementById('continue-button-container').style.display = "block";
        document.getElementById('show-answer-container').style.display = "none";
        document.getElementById('show-tree-container').style.display = "none";
        showTreeDiagram();
        return;
    }
    document.getElementById('try-again-user-input').value = "";
}

function showAnswer() {
    document.getElementById('solution').innerText = `Answer: ${traversals[toGuess].join(', ')}`;
}

function showTreeDiagram() {
    document.getElementById('tree-diagram-header').style.display = "block";
    document.getElementById('tree-diagram').innerText = treeDiagram;
}