class PuzzleState {
    constructor(tiles, parent = null, move = null, g = 0) {
        this.tiles = tiles;
        this.parent = parent;  // 親ノード
        this.move = move;      // この状態への移動
        this.g = g;            // スタートからの移動回数
        this.h = this.calculateH(); // ヒューリスティック値
        this.f = this.g + this.h;   // 合計スコア
    }

    // 状態がゴールかどうか判定するメソッド
    isGoal() {
        const goalState = ['tile_0_0', 'tile_0_1', 'tile_0_2', 'tile_1_0', 'tile_1_1', 'tile_1_2', 'tile_2_0', 'tile_2_1', 'empty'];
        return this.tiles.join('') === goalState.join('');
    }

    calculateH() {
        const goalState = ['tile_0_0', 'tile_0_1', 'tile_0_2', 'tile_1_0', 'tile_1_1', 'tile_1_2', 'tile_2_0', 'tile_2_1', 'empty'];
        return this.tiles.filter((tile, index) => tile !== goalState[index]).length;
    }

    // 可能な子ノード（次の状態）を生成するメソッド
    generateChildStates() {
        let children = [];
        let emptyIndex = this.tiles.indexOf('empty');

        // 空白タイルの移動可能な位置を計算
        let possibleMoves = this.getPossibleMoves(emptyIndex);

        // 各移動に対して新しい状態を生成
        possibleMoves.forEach(index => {
            let newTiles = this.tiles.slice();
            [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
            let moveDescription = `Move tile at index ${index} to empty space`; // 移動の説明
            children.push(new PuzzleState(newTiles, this, moveDescription));
        });

        return children;
    }

    // 空白タイルの移動可能な位置を取得するメソッド
    getPossibleMoves(emptyIndex) {
        let moves = [];
        let row = Math.floor(emptyIndex / 3);
        let col = emptyIndex % 3;

        // 上に移動可能か
        if (row > 0) moves.push(emptyIndex - 3);
        // 下に移動可能か
        if (row < 2) moves.push(emptyIndex + 3);
        // 左に移動可能か
        if (col > 0) moves.push(emptyIndex - 1);
        // 右に移動可能か
        if (col < 2) moves.push(emptyIndex + 1);

        return moves;
    }



    // 状態を文字列で表現するメソッド（探索済み状態のチェックに使用）
    toString() {
        return this.tiles.join(',');
    }



    static dfs(startState) {
        let stack = [startState];
        let visited = new Set();

        while (stack.length > 0) {
            let currentState = stack.pop();

            if (currentState.isGoal()) {
                return currentState;
            }

            let stateStr = currentState.toString();
            if (visited.has(stateStr)) {
                continue;
            }
            visited.add(stateStr);

            let childStates = currentState.generateChildStates();
            childStates.forEach(state => {
                if (!visited.has(state.toString())) {
                    stack.push(state);
                }
            });
        }

        return null;
    }

    // BFSを行う静的メソッド
    static bfs(startState) {
        let queue = [startState];
        let visited = new Set();

        while (queue.length > 0) {
            let currentState = queue.shift();

            if (currentState.isGoal()) {
                return currentState;
            }

            let stateStr = currentState.toString();
            if (visited.has(stateStr)) {
                continue;
            }
            visited.add(stateStr);

            let childStates = currentState.generateChildStates();
            childStates.forEach(state => {
                if (!visited.has(state.toString())) {
                    queue.push(state);
                }
            });
        }

        return null;
    }

    static aStar(startState) {
        let openSet = new PriorityQueue((a, b) => a.f < b.f);
        openSet.enqueue(startState, startState.f);
        let visited = new Set();

        while (!openSet.isEmpty()) {
            let currentState = openSet.dequeue();

            if (currentState.isGoal()) {
                return currentState;
            }

            let stateStr = currentState.toString();
            if (visited.has(stateStr)) {
                continue;
            }
            visited.add(stateStr);

            let childStates = currentState.generateChildStates();
            childStates.forEach(child => {
                let nextState = new PuzzleState(child.tiles, currentState, child.move, currentState.g + 1);
                if (!visited.has(nextState.toString())) {
                    openSet.enqueue(nextState, nextState.f);
                }
            });
        }

        return null;
    }
}

class PriorityQueue {
    constructor(comparator = (a, b) => a > b) {
        this.elements = [];
        this.comparator = comparator;
    }

    enqueue(item, priority) {
        this.elements.push({ item, priority });
        this.elements.sort((a, b) => this.comparator(a.priority, b.priority));
    }

    dequeue() {
        return this.elements.shift().item;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('puzzle-container');
    let tiles = ['tile_0_0', 'tile_0_1', 'tile_0_2', 'tile_1_0', 'tile_1_1', 'tile_1_2', 'tile_2_0', 'tile_2_1', 'empty'];
    let initialState = new PuzzleState(['tile_0_0', 'tile_0_1', 'tile_0_2', 'tile_1_0', 'tile_1_1', 'tile_1_2', 'tile_2_0', 'tile_2_1', 'empty']);

    renderTiles()

    // function renderTiles() {
    //     container.innerHTML = '';
    //     tiles.forEach(tile => {
    //         let tileDiv = document.createElement('div');
    //         tileDiv.classList.add('tile');
    //         if (tile !== 'empty') {
    //             tileDiv.style.backgroundImage = `url('/Users/ta/Desktop/gifu/3.third/second_half/artificial_intelligence/8_PUZZLE/set/image/${tile}.jpg')`;
    //         } else {
    //             tileDiv.classList.add('empty');
    //         }
    //         container.appendChild(tileDiv);
    //         tileDiv.addEventListener('click', () => moveTile(tile));
    //     });
    // }

    function renderTiles() {
        container.innerHTML = '';
        tiles.forEach((tile, index) => {
            let tileDiv = document.createElement('div');
            tileDiv.classList.add('tile');
            if (tile !== 'empty') {
                tileDiv.style.backgroundImage = `url('/Users/ta/Desktop/gifu/3.third/second_half/artificial_intelligence/8_PUZZLE/set/image/${tile}.jpg')`;
                tileDiv.addEventListener('click', () => moveTile(index)); // インデックスに基づいてタイルを動かす
            } else {
                tileDiv.classList.add('empty');
            }
            container.appendChild(tileDiv);
        });
    }

    // 空白タイルを動かす関数
    function moveEmpty(tile) {
        let index = tiles.indexOf(tile);
        let emptyIndex = tiles.indexOf('empty');
        if (canMove(index, emptyIndex)) {
            [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
            renderTiles();
        }
    }

    function moveTile(clickedIndex) {
        let emptyIndex = tiles.indexOf('empty');
    
        if (canMove(clickedIndex, emptyIndex)) {
            [tiles[clickedIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[clickedIndex]];
            renderTiles(); // タイルの状態を更新して再描画
        }
    }
    
    // ボタン操作による空白タイルの移動関数
    function moveEmptyByButton(direction) {
        let emptyIndex = tiles.indexOf('empty');
        let tileToMove;

        switch (direction) {
            case 'up':
                tileToMove = emptyIndex - 3 >= 0 ? tiles[emptyIndex - 3] : null; // 上に移動するため、空白より上のタイルを選択
                break;
            case 'down':
                tileToMove = emptyIndex + 3 < tiles.length ? tiles[emptyIndex + 3] : null; // 下に移動するため、空白より下のタイルを選択
                break;
            case 'left':
                tileToMove = emptyIndex % 3 > 0 ? tiles[emptyIndex - 1] : null; // 左に移動するため、空白より左のタイルを選択
                break;
            case 'right':
                tileToMove = emptyIndex % 3 < 2 ? tiles[emptyIndex + 1] : null; // 右に移動するため、空白より右のタイルを選択
                break;
        }

        if (tileToMove) {
            moveEmpty(tileToMove);
        }
    }


    // タイルが動かせるかどうか判定する関数
    function canMove(clickedIndex, emptyIndex) {
        // 空白タイルとクリックされたタイルが隣接しているかをチェック
        let clickedRow = Math.floor(clickedIndex / 3);
        let clickedCol = clickedIndex % 3;
        let emptyRow = Math.floor(emptyIndex / 3);
        let emptyCol = emptyIndex % 3;
    
        return (clickedRow === emptyRow && Math.abs(clickedCol - emptyCol) === 1) ||
               (clickedCol === emptyCol && Math.abs(clickedRow - emptyRow) === 1);
    }

    function shuffleTiles() {
        let shuffleMoves = 100; // シャッフルのための動きの回数
        let delay = 50; // ミリ秒単位での遅延時間

        for (let i = 0; i < shuffleMoves; i++) {
            setTimeout(function () {
                let emptyIndex = tiles.indexOf('empty');
                let possibleMoves = [];

                // 空白タイルの上にタイルがある場合
                if (emptyIndex >= 3) possibleMoves.push(emptyIndex - 3);
                // 空白タイルの下にタイルがある場合
                if (emptyIndex <= 5) possibleMoves.push(emptyIndex + 3);
                // 空白タイルの左にタイルがある場合
                if (emptyIndex % 3 !== 0) possibleMoves.push(emptyIndex - 1);
                // 空白タイルの右にタイルがある場合
                if (emptyIndex % 3 !== 2) possibleMoves.push(emptyIndex + 1);

                // ランダムに選ばれた動きを実行
                let randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                moveEmpty(tiles[randomMove]);
            }, i * delay);
        }
    }

    let intervalId; // グローバル変数でインターバルIDを保持

    function randomMove() {
        const delay = 200; // 500ミリ秒ごとに動かす
        intervalId = setInterval(function () {
            let emptyIndex = tiles.indexOf('empty');
            let possibleMoves = [];

            if (emptyIndex >= 3) possibleMoves.push(emptyIndex - 3);
            if (emptyIndex <= 5) possibleMoves.push(emptyIndex + 3);
            if (emptyIndex % 3 !== 0) possibleMoves.push(emptyIndex - 1);
            if (emptyIndex % 3 !== 2) possibleMoves.push(emptyIndex + 1);

            let randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            moveEmpty(tiles[randomMove]);
            checkCompletion()
        }, delay);
    }

    function stopRandomMove() {
        clearInterval(intervalId);
    }

    function checkCompletion() {
        const correctOrder = ['tile_0_0', 'tile_0_1', 'tile_0_2', 'tile_1_0', 'tile_1_1', 'tile_1_2', 'tile_2_0', 'tile_2_1', 'empty'];
        if (tiles.join('') === correctOrder.join('')) {
            alert('パズル完成！');
        }
    }

    function displaySolution(goalState) {
        let currentState = goalState;
        let steps = [];

        while (currentState.parent) {
            steps.push(currentState.move);
            currentState = currentState.parent;
        }

        steps.reverse(); // 初期状態からゴール状態への順序にする
        steps.forEach(step => console.log(step));
    }

    // 解を実行する関数内で applyMove を使用
    function executeSolution(solution, renderFunction, span) {
        let stepIndex = 0;

        function nextStep() {
            if (stepIndex < solution.length) {
                applyMove(tiles, solution[stepIndex]);
                renderFunction(); // パズルを再描画

                // 現在の手数を表示

                console.log(`手数: ${stepIndex + 1} / ${solution.length}`);


                stepIndex++;
                setTimeout(nextStep, span); // 次のステップまでの遅延
            }
        }

        nextStep();
    }

    // タイルの状態を更新する関数
    function applyMove(tiles, move) {
        // 移動命令からタイルのインデックスを抽出
        let match = move.match(/index (\d+)/);
        if (!match) return; // 移動命令が正しくない場合は何もしない

        let tileIndex = parseInt(match[1], 10); // インデックスを数値に変換
        let emptyIndex = tiles.indexOf('empty');

        // タイルと空白タイルの位置を交換
        [tiles[emptyIndex], tiles[tileIndex]] = [tiles[tileIndex], tiles[emptyIndex]];
    }

    //解の手順を取得する関数
    function getSolutionSteps(goalState) {
        let currentState = goalState;
        let steps = [];

        while (currentState.parent) {
            steps.push(currentState.move);
            currentState = currentState.parent;
        }

        return steps.reverse(); // 初期状態からゴール状態への順序
    }





    // ボタンにイベントリスナーを追加
    document.getElementById('move-up').addEventListener('click', () => moveEmptyByButton('up'));
    document.getElementById('move-down').addEventListener('click', () => moveEmptyByButton('down'));
    document.getElementById('move-left').addEventListener('click', () => moveEmptyByButton('left'));
    document.getElementById('move-right').addEventListener('click', () => moveEmptyByButton('right'));

    document.getElementById('shuffle-button').addEventListener('click', shuffleTiles);
    document.getElementById('start-random-moves').addEventListener('click', randomMove);
    document.getElementById('stop-random-moves').addEventListener('click', stopRandomMove);
    document.getElementById('check-button').addEventListener('click', checkCompletion);

    document.getElementById('dfs-button').addEventListener('click', function () {
        let initialState = new PuzzleState([...tiles]);
        let goalState = PuzzleState.dfs(initialState);

        if (goalState) {
            console.log("ゴールに到達しました！");
            let solution = getSolutionSteps(goalState);
            console.log(`解を見つけました。手数: ${solution.length}`);
            executeSolution(solution, renderTiles, 1); // 解を実行する関数を呼び出す
        } else {
            console.log("ゴールに到達できませんでした。");
        }
    });

    document.getElementById('bfs-button').addEventListener('click', function () {
        let initialState = new PuzzleState([...tiles]);
        let goalState = PuzzleState.bfs(initialState);

        if (goalState) {
            console.log("ゴールに到達しました！");
            let solution = getSolutionSteps(goalState);
            displaySolution(solution);
            executeSolution(solution, renderTiles, 500);
        } else {
            console.log("ゴールに到達できませんでした。");
        }
    });

    document.getElementById('astar-button').addEventListener('click', function() {
        let initialState = new PuzzleState([...tiles]);
        let goalState = PuzzleState.aStar(initialState);
    
        if (goalState) {
            console.log("ゴールに到達しました！");
            let solution = getSolutionSteps(goalState);
            console.log(`解を見つけました。手数: ${solution.length}`);
            executeSolution(solution, renderTiles,500);
        } else {
            console.log("ゴールに到達できませんでした。");
        }
    });

});
