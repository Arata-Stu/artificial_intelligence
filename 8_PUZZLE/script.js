document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('puzzle-container');
    let tiles = ['tile_0_0', 'tile_0_1', 'tile_0_2', 'tile_1_0', 'tile_1_1', 'tile_1_2', 'tile_2_0', 'tile_2_1', 'empty'];

    shuffleTiles();

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
        console.log("",adjacentRow || adjacentCol)
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

    document.getElementById('shuffle-button').addEventListener('click', shuffleTiles);
});
