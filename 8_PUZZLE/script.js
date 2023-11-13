document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('puzzle-container');
    let tiles = ['tile_0_0', 'tile_0_1', 'tile_0_2', 'tile_1_0', 'tile_1_1', 'tile_1_2', 'tile_2_0', 'tile_2_1', 'empty'];

    renderTiles()
    
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

    document.getElementById('move-up').addEventListener('click', moveEmptyDown); // 空白を上に動かすため下のタイルを上に移動
    document.getElementById('move-down').addEventListener('click', moveEmptyUp); // 空白を下に動かすため上のタイルを下に移動
    document.getElementById('move-left').addEventListener('click', moveEmptyRight); // 空白を左に動かすため右のタイルを左に移動
    document.getElementById('move-right').addEventListener('click', moveEmptyLeft); // 空白を右に動かすため左のタイルを右に移動

    document.getElementById('shuffle-button').addEventListener('click', shuffleTiles);
});
