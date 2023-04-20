const startModal = document.getElementById('startModal');
const startContainer = document.getElementById('startContainer');

startContainer.addEventListener('click', ()=>{
    startModal.style.opacity = 0;
    startModal.style.zIndex = -1;
    play();
})

function play(){
    // cronômetro
    var divCronometro = document.getElementById('position_relative');
    divCronometro.style.opacity = 1;
    divCronometro.style.zIndex = 1;
    var hour = 0;
    var minute = 0;
    var second = 0;
    var millisecond = 0;
    var cron;
    cron = setInterval(()=> {timer();}, 10);
    function timer() {
        if ((millisecond += 10) == 1000) {
            millisecond = 0;
            second++;
        }
        if (second == 60) {
            second = 0;
            minute++;
        }
        if (minute == 60) {
            minute = 0;
            hour++;
        }
        document.getElementById('hour').innerText = returnData(hour);
        document.getElementById('minute').innerText = returnData(minute);
        document.getElementById('second').innerText = returnData(second);
        document.getElementById('millisecond').innerText = returnData(millisecond);
    }
        
    function returnData(input) {
        return input > 10 ? input : `0${input}`
    }

    // definindo o canvas
    var cnv = document.querySelector("canvas");
    var ctx = cnv.getContext("2d");
    // dimensões
    var WIDTH = cnv.width, HEIGHT = cnv.height;
    // pixel do canvas
    var tileSize = 32;

    // imagem com o personagem e os blocos do layout
    var img = new Image();
    img.src = "img/img.png";
    // pixel da imagem
    var tileSrcSize = 96;
    // jogo renderiza apenas com a imagem carregada
    img.addEventListener("load", function(){
        requestAnimationFrame(loop, cnv); // responsável pela primeira chamada à função loop
    }, false);
    // imagem com o ponto de saída
    var imgSaida = new Image();
    imgSaida.src = "img/many_diego.png";
    var tileSaidaSize = 60;
    // imagem do inimigo
    var imgInimigo = new Image();
    imgInimigo.src = "img/inimigo.png";

    // personagem
    var player = {
        x: tileSize,
        y: tileSize,
        xMaze: 1,
        yMaze: 1,
        width: 24,
        height: 32,
        speed: 2,
        srcX: 0,
        srcY: tileSrcSize,
        countAnim: 0
    }; 
    // movimentação do personagem
    var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40; // códigos das setas do teclado
    var mvLeft = false, mvUp = false, mvRight = false, mvDown = false; // personagem começa parado

    // inimigo
    var posEnemy = 576;
    var enemy = {
        x: posEnemy,
        y: posEnemy,
        xMaze: 18,
        yMaze: 18,
        width: 24,
        height: 32,
        speed: 1,
        srcX: 0,
        srcY: tileSrcSize,
        direction: 'up',
        countAnim: 0
    };
    changeDirection();

    // labirinto inicializado sem paredes
    var maze = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    // tamanho total do layout do labirinto
    var T_WIDTH = maze[0].length * tileSize,
        T_HEIGHT = maze.length * tileSize;
    // paredes para colisão
    var walls = [];

    // sortear valores para definir um labirinto aleatório
    function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    addInnerWalls(true, 1, maze.length - 2, 1, maze.length - 2);

    // adicionar paredes internas ao maze, definindo a estrutura do labirinto
    function addInnerWalls(flag, larguraMin, larguraMax, alturaMin, alturaMax){
        if(flag){
            if(larguraMax - larguraMin < 2){
                return;
            }
            var alturaAux = Math.floor(randomNum(alturaMin, alturaMax) / 2) * 2;
            addHorizWall(larguraMin, larguraMax, alturaAux);

            addInnerWalls(!flag, larguraMin, larguraMax, alturaMin, alturaAux - 1);
            addInnerWalls(!flag, larguraMin, larguraMax, alturaAux + 1, alturaMax);
        } else {
            if(alturaMax - alturaMin < 2){
                return;
            }
            var larguraAux = Math.floor(randomNum(larguraMin, larguraMax) /2 ) * 2;
            addVerticalWall(alturaMin, alturaMax, larguraAux);

            addInnerWalls(!flag, larguraMin, larguraAux - 1, alturaMin, alturaMax);
            addInnerWalls(!flag, larguraAux + 1, larguraMax, alturaMin, alturaMax);
        }
    }

    // adicionar paredes horizontais
    function addHorizWall(larguraMin, larguraMax, alturaAux){
        var z = Math.floor(randomNum(larguraMin, larguraMax) / 2) * 2 + 1;
        for(var i = larguraMin; i < larguraMax; i++){
            if(i === z){
                maze[alturaAux][i] = 0;
            } else{
                maze[alturaAux][i] = 1;
            }
        }
    }

    // adicionar paredes verticais
    function addVerticalWall(alturaMin, alturaMax, larguraAux){
        var z = Math.floor(randomNum(alturaMin, alturaMax) / 2) * 2 + 1;
        for(var i = alturaMin; i < alturaMax; i++){
            if(i === z){
                maze[i][larguraAux] = 0;
            } else {
                maze[i][larguraAux] = 1;
            }
        }
    }

    addOuterWalls();

    // Adicionar paredes externas "moldura" ao maze
    function addOuterWalls(){
        for(var i = 0; i < maze.length; i++){
            if(i == 0 || i == (maze.length - 1)){
                for(var j = 0; j < maze.length; j++){
                    maze[i][j] = 1;
                }
            } else {
                maze[i][0] = 1;
                maze[i][maze.length - 1] = 1;
            }
        }
    }

    // definir a saida do labirinto 
    var saida = randomNum(1, maze.length - 2);

    maze[maze.length - 1][saida] = 0;
    maze[maze.length - 2][saida] = 0;

    var blockSaida = {
        x: tileSize * (maze.length - 1),
        y: tileSize * saida,
        width: tileSize,
        height: tileSize
    }

    // esperar teclas de movimentação
    window.addEventListener("keydown", keydownHandler, false); 
    window.addEventListener("keyup", keyupHandler, false);

    // tornar as paredes sensíveis à colisão
    function makeWalls(){
        for(var row in maze){
            for(var column in maze[row]){
                var tile = maze[row][column];
                if(tile === 1){
                    // paredes de colisão
                    var wall = {
                        x: tileSize*column,
                        y: tileSize*row,
                        width: tileSize,
                        height: tileSize
                    };
                    walls.push(wall);
                }
            }
        }
    }

    // personagem se move
    function keydownHandler(e){
        var key = e.keyCode;
        switch(key){
            case LEFT:
                mvLeft = true;
                break;
            case RIGHT:
                mvRight = true;
                break;
            case UP:
                mvUp = true;
                break;
            case DOWN:
                mvDown = true;
                break;
        }
    }

    // personagem para de se mover
    function keyupHandler(e){ 
        var key = e.keyCode;
        switch(key){
            case LEFT:
                mvLeft = false;
                break;
            case RIGHT:
                mvRight = false;
                break;
            case UP:
                mvUp = false;
                break;
            case DOWN:
                mvDown = false;
                break;
        }
    }

    // movimentação constante do personagem
    function movePlayer(){
        if(mvLeft && !mvRight){ // se move para a esquerda
            player.x -= player.speed;
            player.xMaze = Math.floor(player.x / tileSize);
            player.srcY = tileSrcSize + player.height * 2;
        } else if(mvRight && !mvLeft){ // se move para a direita
            player.x += player.speed;
            player.xMaze = Math.floor(player.x / tileSize);
            player.srcY = tileSrcSize + player.height * 3;
        }

        if(mvUp && !mvDown){ // se move para cima
            player.y -= player.speed;
            player.yMaze = Math.floor(player.y / tileSize);
            player.srcY = tileSrcSize + player.height * 1;
        } else if(mvDown && !mvUp){ // se move para baixo
            player.y += player.speed;
            player.yMaze = Math.floor(player.y / tileSize);
            player.srcY = tileSrcSize + player.height * 0;
        }
        checkWin();
        checkEnemy();
    }

    // alterar direção do inimigo
    function changeDirection(){
        switch(enemy.direction){
            case 'left':
                enemy.x -= enemy.speed;
                enemy.xMaze = Math.floor(enemy.x / tileSize);
                enemy.srcY = tileSrcSize + enemy.height * 2;
            break;
            case 'right':
                enemy.x += enemy.speed;
                enemy.xMaze = Math.floor(enemy.x / tileSize);
                enemy.srcY = tileSrcSize + enemy.height * 3;
            break;
            case 'up':
                enemy.y -= enemy.speed;
                enemy.yMaze = Math.floor(enemy.y / tileSize);
                enemy.srcY = tileSrcSize + enemy.height * 1;
            break;
            case 'down':
                enemy.y += enemy.speed;
                enemy.yMaze = Math.floor(enemy.y / tileSize);
                enemy.srcY = tileSrcSize + enemy.height * 0;
            break;
        }
    }

    // movimentação do inimigo
    function moveEnemy(){
        if(Math.floor(enemy.x)%tileSize === 0 & Math.floor(enemy.y)%tileSize === 0){
            var enemyCol = enemy.xMaze;
            var enemyRow = enemy.yMaze;
            var validPath = [];

            // Direções possíveis
            if(maze[enemyRow][enemyCol - 1] !== 1 && (enemy.direction !== 'right')){ // célula à esquerda é válida
                validPath.push('left');
                console.log('left');
            } 
            if(maze[enemyRow][enemyCol + 1] !== 1 && (enemy.direction !== 'left')){ // célula à direia é válida
                validPath.push('right');
                console.log('right');
            } 
            if(maze[enemyRow - 1][enemyCol] !== 1 && (enemy.direction !== 'down')){ // célula acima é válida
                validPath.push('up');
                console.log('up');
            } 
            if(maze[enemyRow + 1][enemyCol] !== 1 && (enemy.direction !== 'up')){ // célula abaixo é válida
                validPath.push('down');
                console.log('down');
            } 
            enemy.direction = validPath[Math.floor(Math.random() * validPath.length)];
            enemy.countAnim++;
        } 
        changeDirection();
    }

    // sensação de movimento enquanto o personagem se move
    function feelMovements(){
        if(mvLeft || mvRight || mvUp || mvDown){
            player.countAnim++;

            if(player.countAnim >= 40){
                player.countAnim = 0;
            }

            player.srcX = Math.floor(player.countAnim / 5) * player.width;
        } else{
            player.srcX = 0;
            player.countAnim = 0;
        }
    }

    // cálculos do personagem em relação à parede
    function checkPlayerWall(objA,objB){
        // distância X entre o personagem e a parede
		var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2);
        // distância Y entre o personagem e a parede
		var distY = (objA.y + objA.height/2) - (objB.y + objB.height/2);
		
		var sumWidth = (objA.width + objB.width)/2;
		var sumHeight = (objA.height + objB.height)/2;
		
		if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight){ // houve colisão
			var overlapX = sumWidth - Math.abs(distX);
			var overlapY = sumHeight - Math.abs(distY);
			
			if(overlapX > overlapY){
				objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY;
			} else {
				objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX;
			}
		}
	}

    // verificar se o personagem colidiu com alguma parede
    function checkCollision(){
        for(var i in walls){
            var wall = walls[i];
            checkPlayerWall(player, wall);
        }
    }

    function checkWin(){
        if(player.xMaze === (blockSaida.y / tileSize) && player.yMaze === (blockSaida.x / tileSize)){
            clearInterval(cron);
            alert('Fim de Jogo. Você venceu!');
        }
    }

    function checkEnemy(){
        if(player.xMaze === enemy.xMaze && player.yMaze === enemy.yMaze){
            clearInterval(cron);
            alert('Fim de Jogo. Você perdeu!');
        }
    }

    // atualizar elementos do jogo
    function update(){ 
        movePlayer();
        moveEnemy();
        feelMovements();
        checkCollision();
    }

    // representar graficamente os elementos do jogo
    function render(){ 
        ctx.clearRect(0,0,WIDTH,HEIGHT);
        ctx.save();
        for(var row in maze){
            for(var column in maze[row]){
                var tile = maze[row][column];

                // coordenadas
                var x = column*tileSize; 
                var y = row*tileSize;
                // blocos
                ctx.drawImage(
                    img,
                    tile * tileSrcSize,0,tileSrcSize,tileSrcSize,
                    x, y, tileSize, tileSize
                );
            }
        }
        // saida
        ctx.drawImage(
            imgSaida,
            maze[maze.length - 1][saida] * tileSrcSize, 0, tileSrcSize, tileSrcSize,
            blockSaida.y, blockSaida.x, tileSaidaSize, tileSaidaSize
        );
        // personagem principal
        ctx.drawImage(
            img,
            player.srcX, player.srcY, player.width, player.height,
            player.x, player.y, player.width, player.height
        );

        //inimigo
        ctx.drawImage(
            imgInimigo,
            enemy.srcX, enemy.srcY, enemy.width, enemy.height,
            enemy.x, enemy.y, enemy.width, enemy.height
        );
        ctx.restore();
    }

    // repete as demais funções de modo recursivo
    function loop(){ 
        makeWalls();
        update();
        render();
        requestAnimationFrame(loop, cnv);
    }
}