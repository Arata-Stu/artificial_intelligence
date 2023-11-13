document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('puzzle-container');
    let tiles = ['tile_0_0', 'tile_0_1', 'tile_0_2', 'tile_1_0', 'tile_1_1', 'tile_1_2', 'tile_2_0', 'tile_2_1', 'empty'];

    //shuffleTiles();
    renderTiles()
    function shuffleTiles() {
        shuffleArray(tiles);
        renderTiles();
    }

    function renderTiles() {
        container.innerHTML = '';
        tiles.forEach(tile => {
            let tileDiv = document.createElement('div');
            tileDiv.classList.add('tile');
            if (tile !== 'empty') {
                tileDiv.style.backgroundImage = `url('/Users/ta/Desktop/gifu/3.third/second_half/artificial_intelligence/8_PUZZLE/set/image/${tile}.jpg')`;
            } else {
                tileDiv.classList.add('empty');
            }
            container.appendChild(tileDiv);
            tileDiv.addEventListener('click', () => moveTile(tile));
        });
    }

    function getCurrentStateMatrix() {
        let matrix = [[], [], []]; // 3x3の行列を初期化
        for (let i = 0; i < tiles.length; i++) {
            let row = Math.floor(i / 3); // 行のインデックス
            let col = i % 3; // 列のインデックス
            matrix[row][col] = tiles[i]; // 対応する位置にタイルを配置
        }
        console.log(matrix); // 行列をコンソールに表示
        return matrix;
    }

    function moveTile(tile) {
        let index = tiles.indexOf(tile);
        let emptyIndex = tiles.indexOf('empty');
        if (canMove(index, emptyIndex)) {
            [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
            renderTiles();
            checkCompletion();
        }
    }

    function canMove(index, emptyIndex) {
        // タイルの行と列を計算
        let row = Math.floor(index / 3);
        let col = index % 3;
        let emptyRow = Math.floor(emptyIndex / 3);
        let emptyCol = emptyIndex % 3;

        // 空白タイルの隣かどうかを判定
        let adjacentRow = row === emptyRow && Math.abs(col - emptyCol) === 1;
        let adjacentCol = col === emptyCol && Math.abs(row - emptyRow) === 1;
        console.log("", adjacentRow || adjacentCol)
        return adjacentRow || adjacentCol;
    }

    function checkCompletion() {
        if (tiles.join('') === 'tile_0_0tile_0_1tile_0_2tile_1_0tile_1_1tile_1_2tile_2_0tile_2_1empty') {
            alert('パズル完成！');
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let moveInterval;

    function randomMove() {
        let emptyIndex = tiles.indexOf('empty');
        let possibleMoves = [];

        // 空白タイルの隣接するインデックスを取得
        let adjacentIndices = [
            emptyIndex - 3, // 上
            emptyIndex + 3, // 下
            emptyIndex % 3 !== 0 ? emptyIndex - 1 : -1, // 左 (左端ではない場合のみ)
            emptyIndex % 3 !== 2 ? emptyIndex + 1 : -1, // 右 (右端ではない場合のみ)
        ];

        // 有効な移動のみを選択
        adjacentIndices.forEach(i => {
            if (i >= 0 && i < tiles.length && canMove(i, emptyIndex)) {
                possibleMoves.push(i);
            }
        });

        // 移動が可能な場合、ランダムに選択して移動
        if (possibleMoves.length > 0) {
            let randomIndex = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            [tiles[emptyIndex], tiles[randomIndex]] = [tiles[randomIndex], tiles[emptyIndex]];
            renderTiles();
        }

        checkCompletion();
    }

    function startRandomMoves() {
        if (moveInterval) clearInterval(moveInterval);
        moveInterval = setInterval(randomMove, 500); // 500ミリ秒ごとにランダム移動
    }

    function stopRandomMoves() {
        if (moveInterval) clearInterval(moveInterval);
    }

    // パズルが完成したかどうかのチェックをアップデート
    function checkCompletion() {
        if (tiles.join('') === 'tile_0_0tile_0_1tile_0_2tile_1_0tile_1_1tile_1_2tile_2_0tile_2_1empty') {
            alert('パズル完成！');
            stopRandomMoves(); // パズル完成時にランダム移動を停止
        }
    }

    function generateChildNodes(stateMatrix) {
        let emptyRow, emptyCol;
        let childNodes = [];

        // 空白タイルの位置を見つける
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (stateMatrix[row][col] === 'empty') {
                    emptyRow = row;
                    emptyCol = col;
                    break;
                }
            }
        }

        // 移動可能な方向を確認し、子ノードを生成する
        [
            [emptyRow - 1, emptyCol], // 上
            [emptyRow + 1, emptyCol], // 下
            [emptyRow, emptyCol - 1], // 左
            [emptyRow, emptyCol + 1]  // 右
        ].forEach(([newRow, newCol]) => {
            if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
                let newMatrix = stateMatrix.map(row => row.slice()); // 行列をコピー
                [newMatrix[emptyRow][emptyCol], newMatrix[newRow][newCol]] = [newMatrix[newRow][newCol], newMatrix[emptyRow][emptyCol]]; // タイルを交換
                childNodes.push(newMatrix);
            }
        });

        return childNodes;
    }

    // 現在の状態から子ノードを生成して表示するためのテスト関数
    function testGenerateChildNodes() {
        let currentStateMatrix = getCurrentStateMatrix();
        let childNodes = generateChildNodes(currentStateMatrix);
        console.log('子ノード:', childNodes);
    }

    // 深さ優先探索を実行する関数
    function depthFirstSearch() {
        // ゴール状態の定義

        let searchCount = 0; // 探索回数をカウント
        const goalState = [
            ['tile_0_0', 'tile_0_1', 'tile_0_2'],
            ['tile_1_0', 'tile_1_1', 'tile_1_2'],
            ['tile_2_0', 'tile_2_1', 'empty']
        ];

        // オープンリストとクローズリスト
        let openList = [];
        let closeList = [];

        // 初期状態をオープンリストに追加
        openList.push(getCurrentStateMatrix());

        while (openList.length > 0) {
            let currentState = openList.pop();
            searchCount++;

            // ゴール状態のチェック
            if (isGoalState(currentState, goalState)) {
                console.log('ゴールに到達しました！');
                return; // ゴール状態に到達した場合、関数から抜ける
            }

            if (searchCount % 1000 === 0) { // 1000回ごとに状態を出力
                console.log(`探索回数: ${searchCount}, 現在のスタックサイズ: ${openList.length}`);
                console.log('現在の状態:', currentState);
            }
    

            // 現在の状態をクローズリストに追加
            closeList.push(currentState);

            // 子ノードを生成してオープンリストに追加
            let childNodes = generateChildNodes(currentState);
            childNodes.forEach(node => {
                if (!isInCloseList(node, closeList)) {
                    openList.push(node);
                }
            });
        }

        console.log('ゴール状態に到達できませんでした。');
    }

    // ゴール状態を判定する関数
    function isGoalState(state, goalState) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (state[row][col] !== goalState[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    // クローズリストに状態が含まれているかチェックする関数
    function isInCloseList(state, closeList) {
        return closeList.some(closeState => areStatesEqual(state, closeState));
    }

    // 2つの状態が等しいかどうかをチェックする関数
    function areStatesEqual(state1, state2) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (state1[row][col] !== state2[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    // 新しいテストボタンのイベントリスナーを追加
    document.getElementById('test-generate-nodes').addEventListener('click', testGenerateChildNodes);

    // HTMLに追加するためのボタンのイベントリスナー
    document.getElementById('start-random-moves').addEventListener('click', startRandomMoves);
    document.getElementById('stop-random-moves').addEventListener('click', stopRandomMoves);
    document.getElementById('shuffle-button').addEventListener('click', shuffleTiles);
    document.getElementById('get-matrix-button').addEventListener('click', getCurrentStateMatrix);
    document.getElementById('dfs').addEventListener('click', depthFirstSearch);
});
