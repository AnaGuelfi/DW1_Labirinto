const startModal = document.getElementById('startModal');
const startContainer = document.getElementById('startContainer');

startContainer.addEventListener('click', ()=>{
    startModal.style.opacity = 0;
    startModal.style.zIndex = -1;
    play();
})

function play(){
    // definindo o canvas
    var cnv = document.querySelector("canvas");
    var ctx = cnv.getContext("2d");
    // dimensões
    var WIDTH = cnv.width, HEIGHT = cnv.height;
    // pixel do canvas
    var tileSize = 32;

    // imagem
    var img = new Image();
    img.src = "img/img.png";
    // pixel da imagem
    var tileSrcSize = 96;
    // jogo renderiza apenas com a imagem carregada
    img.addEventListener("load", function(){
        requestAnimationFrame(loop, cnv); // responsável pela primeira chamada à função loop
    }, false);
    var imgSaida = new Image();
    imgSaida.src = "img/many_diego.png";
    var tileSaidaSize = 60;

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
        for(var i = larguraMin; i <= larguraMax; i++){
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
        for(var i = alturaMin; i <= alturaMax; i++){
            if(i === z){
                maze[i][larguraAux] = 0;
            } else {
                maze[i][larguraAux] = 1;
            }
        }
    }

    // definir a saida do labirinto 
    var saida = randomNum(0, maze.length - 1);
    maze[maze.length - 1][saida] = 0;
    var blockSaida = {
        x: tileSize * (maze.length - 1),
        y: tileSize * saida,
        width: tileSize,
        height: tileSize
    }

    // câmera
    var cam = {
        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT,
        // limites
        innerLeftBoundary: function(){ 
            return this.x + (this.width * 0.25);
        },
        innerTopBoundary: function(){
            return this.y + (this.height * 0.25);
        },
        innerRightBoundary: function(){
            return this.x + (this.width * 0.75);
        },
        innerBottomBoundary: function(){
            return this.y + (this.height * 0.75);
        }
    };

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
        console.log('PLAYER ', player.xMaze, ' - ', player.yMaze);
        console.log('BLOCO ', blockSaida.x / tileSize, ' - ', blockSaida.y / tileSize);
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
            alert('WIN');
        }
    }

    // acompanhamento da câmera em função da posição do personagem
    function moveCam(){
        if(player.x < cam.innerLeftBoundary()){
           cam.x = player.x - (cam.width * 0.25);
        }
        if(player.y < cam.innerTopBoundary()){
            cam.y = player.y - (cam.height * 0.25);
        }
        if(player.x + player.width > cam.innerRightBoundary()){
            cam.x = player.x + player.width - (cam.width * 0.75);
        }
        if(player.y + player.height > cam.innerBottomBoundary()){
            cam.y = player.y + player.height - (cam.height * 0.75);
        }
    }

    // ajuste nas coordenadas da câmera para se enquadrarem no layout total do labirinto
    function updateCam(){
        cam.x = Math.max(0, Math.min(T_WIDTH - cam.width, cam.x));
        cam.y = Math.max(0, Math.min(T_HEIGHT - cam.height, cam.y));
    }

    // atualizar elementos do jogo
    function update(){ 
        movePlayer();
        feelMovements();
        checkCollision();
        moveCam();
        updateCam();
    }

    // representar graficamente os elementos do jogo
    function render(){ 
        ctx.clearRect(0,0,WIDTH,HEIGHT);
        ctx.save();
        ctx.translate(-cam.x, -cam.y);
        for(var row in maze){
            for(var column in maze[row]){
                var tile = maze[row][column];

                // coordenadas
                var x = column*tileSize; 
                var y = row*tileSize;

                ctx.drawImage(
                    img,
                    tile * tileSrcSize,0,tileSrcSize,tileSrcSize,
                    x, y, tileSize, tileSize
                );
            }
        }

        ctx.drawImage(
            imgSaida,
            maze[maze.length - 1][saida] * tileSrcSize, 0, tileSrcSize, tileSrcSize,
            blockSaida.y, blockSaida.x, tileSaidaSize, tileSaidaSize
        );

        ctx.drawImage(
            img,
            player.srcX, player.srcY, player.width, player.height,
            player.x, player.y, player.width, player.height
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