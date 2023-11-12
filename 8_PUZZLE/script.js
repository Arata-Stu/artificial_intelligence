document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('puzzle-container');
    let tiles = ['1', '2', '3', '4', '5', '6', '7', '8', ''];

    // タイルをシャッフルして配置
    shuffleTiles();

    function shuffleTiles() {
        shuffleArray(tiles);
        renderTiles();
    }

    function renderTiles() {
        container.innerHTML = '';
        tiles.forEach(num => {
            let tile = document.createElement('div');
            tile.classList.add('tile');
            if (num === '') {
                tile.classList.add('empty');
            } else {
                tile.innerText = num;
            }
            container.appendChild(tile);
            tile.addEventListener('click', () => moveTile(num));
        });
    }

    function moveTile(num) {
        let index = tiles.indexOf(num);
        let emptyIndex = tiles.indexOf('');
        if (canMove(index, emptyIndex)) {
            [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
            renderTiles();
            checkCompletion();
        }
    }

    function canMove(index, emptyIndex) {
        // 上下左右の位置を計算
        let row = Math.floor(index / 3);
        let col = index % 3;
        let emptyRow = Math.floor(emptyIndex / 3);
        let emptyCol = emptyIndex % 3;

        // 空白の隣であれば動かせる
        return (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
               (col === emptyCol && Math.abs(row - emptyRow) === 1);
    }

    function checkCompletion() {
        if (tiles.join('') === '12345678') {
            alert('パズル完成！');
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // シャッフルボタンのイベントリスナー
    document.getElementById('shuffle-button').addEventListener('click', shuffleTiles);
});
