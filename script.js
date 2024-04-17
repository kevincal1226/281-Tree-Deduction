let randomInt = -1
let input = []
let startArr = []
let numIterations = -1
let winStreak = 0
let bestWinStreak = 0
let numQuestions = 0
let numCorrect = 0
let traversals = ["Pre", "Post"]
let preList = []
let postList = []
let inList = []

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
        if(this.root === null){
            this.root = newNode;
            return this;
        }

        let current = this.root;
        while(current){
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
    return [pre, ino, post];

}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        checkAnswer();
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
    start();

});

function start() {
    document.getElementById('answer-container').style.display = "none";
    document.getElementById('answer-selection').style.display = "block";
    document.getElementById('solution').innerText = "";
    randomInt = Math.floor(Math.random() * 2);
    [preList, inList, postList] = generateTree();
    document.getElementById('pptraversal').innerText = traversals[randomInt] + "order Traversal: " + (randomInt == 0 ? preList.join(', ') : postList.join(', '));
    document.getElementById('inorder').innerText = "Inorder Traversal: " + inList.join(', ');
    document.getElementById('give-the-blank-order-traversal').innerText = `Give the ${traversals[(randomInt + 1) % 2]}order traversal as a comma-separated list:`;
}

function checkAnswer() {
    ++numQuestions;
    let userAnswer = document.getElementById('user-input').value.trim();
    userAnswer = userAnswer.replace(/ |[\[{()}\]]/g, "");
    userAnswer = userAnswer.replace()
    if (JSON.stringify(userAnswer) === JSON.stringify(randomInt === 1 ? preList.join(',') : postList.join(','))) {
        document.getElementById('answer-container').style.display = "block";
        document.getElementById('answer-selection').style.display = "none";
        document.getElementById('solution').style.color = "#0fa328";
        document.getElementById('solution').innerText = winStreak < 100 ? `Correct (Answer: ${randomInt === 1 ? preList.join(', ') : postList.join(', ')})` : 'STD Wizard! (Merlinius, is that you?)';
        numCorrect++;
        winStreak++;
        bestWinStreak = Math.max(winStreak, bestWinStreak);
    }
    else {
        document.getElementById('answer-container').style.display = "block";
        document.getElementById('answer-selection').style.display = "none";
        document.getElementById('solution').style.color = "#ff2f2f";
        document.getElementById('solution').innerText = `Incorrect (Answer: ${randomInt === 1 ? preList.join(', ') : postList.join(', ')})`;
        winStreak = 0;        
    }

    document.getElementById('total-questions').innerText = `Questions Attempted: ${numQuestions}`;
    document.getElementById('accuracy').innerText = `Accuracy: ${(parseFloat(numCorrect) / parseFloat(numQuestions) * 100).toFixed(2)}%`;
    document.getElementById('win-streak').innerText = `Current Win Streak: ${winStreak}`;
    document.getElementById('best-win-streak').innerText = `Best Win Streak: ${bestWinStreak}`;
    document.getElementById('user-input').value = "";
}

function correctAnswer(typeIdx) {
    document.getElementById('answer-container').style.display = "block";
    document.getElementById('answer-selection').style.display = "none";
    document.getElementById('solution').style.color = "#0fa328";
    document.getElementById('solution').innerText = winStreak < 100 ? `Correct` : 'STD Wizard! (Merlinius, is that you?)';
    numCorrect++;
    winStreak++;
    bestWinStreak = Math.max(winStreak, bestWinStreak);
}

function verifySort(type) {
    numQuestions++;
    if (type.includes(randomInt) || JSON.stringify(input) === JSON.stringify(startArr) || JSON.stringify(input) === JSON.stringify([...startArr].sort(function (a, b) {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }))) {
        correctAnswer(randomInt);
    }
    else {
        if (userAnswerWorks(type[0])) {
            if (type[0] !== 0) {
                correctAnswer(type[0]);
            }
        }
        else {
            document.getElementById('answer-container').style.display = "block";
            document.getElementById('answer-selection').style.display = "none";
            document.getElementById('solution').style.color = "#ff2f2f";
            document.getElementById('solution').innerText = `Incorrect (Answer: ${sortsNames[randomInt]})`;
            winStreak = 0;
        }
    }
    document.getElementById('total-questions').innerText = `Questions Attempted: ${numQuestions}`;
    document.getElementById('accuracy').innerText = `Accuracy: ${(parseFloat(numCorrect) / parseFloat(numQuestions) * 100).toFixed(2)}%`;
    document.getElementById('win-streak').innerText = `Current Win Streak: ${winStreak}`;
    document.getElementById('best-win-streak').innerText = `Best Win Streak: ${bestWinStreak}`;
}