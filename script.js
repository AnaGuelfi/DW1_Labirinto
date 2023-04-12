(function(){
    var cnv = document.querySelector("canvas");
    var ctx = cnv.getContext("2d");
    // pixel do canvas
    var tileSize = 64;
    // pixel da imagem
    var tileSrcSize = 96;
    // imagem
    var img = new Image();
    img.src = "img/img.png";
    // jogo renderiza apenas com a imagem carregada
    img.addEventListener("load", function(){
        requestAnimationFrame(loop, cnv); // responsável pela primeira chamada à função loop
    }, false);
    // dimensões do canvas
    var WIDTH = cnv.width, HEIGHT = cnv.height;

    // personagem
    var player = {
        x: tileSize + 2,
        y: tileSize + 2,
        width: 28,
        height: 28,
        speed: 2
    }; 
    // movimentação do personagem
    var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40; // códigos das setas do teclado
    var mvLeft = false, mvUp = false, mvRight = false, mvDown = false; // personagem começa parado

    // paredes para colisão
    var walls = [];

    // caminho do labirinto
    var maze = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    // tamanho total do layout do labirinto
    var T_WIDTH = maze[0].length * tileSize,
        T_HEIGHT = maze.length * tileSize;

    // tornar as paredes sensíveis à colisão
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

    // câmera
    var cam = {
        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT,
        // limite
        innerLeftBoundary: function(){
            return this.x + (this.width*0.25);
        },
        innerTopBoundary: function(){
            return this.y + (this.height*0.25);
        },
        innerRightBoundary: function(){
            return this.x + (this.width*0.75);
        },
        innerBottomBoundary: function(){
            return this.y + (this.height*0.75);
        },
    };

    function blockRectangle(objA,objB){
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

    // esperar teclas de movimentação
    window.addEventListener("keydown", keydownHandler, false); 
    window.addEventListener("keyup", keyupHandler, false);

    function keydownHandler(e){ // personagem se move
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

    function keyupHandler(e){ // personagem para de se mover
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

    function update(){ // atualizar elementos do jogo
        // movimentaçao
        if(mvLeft && !mvRight){ // se move para a esquerda
            player.x -= player.speed;
        } else if(mvRight && !mvLeft){ // se move para a direita
            player.x += player.speed;
        }

        if(mvUp && !mvDown){ // se move para cima
            player.y -= player.speed;
        } else if(mvDown && !mvUp){ // se move para baixo
            player.y += player.speed;
        }

        // verificar se o personagem colidiu com alguma parede
        for(var i in walls){
            var wall = walls[i];
            blockRectangle(player, wall);
        }

        // acompanhamento da câmera em função da posição do personagem
        if(player.x < cam.innerLeftBoundary()){
            cam.x = player.x - (cam.width * 0.25);
        }
        if(player.y < cam.innerTopBoundary){
            cam.y = player.y - (cam.height * 0.25);
        }
        if(player.x + player.width > cam.innerRightBoundary){
            cam.x = player.x + player.width - (cam.width * 0.75);
        }
        if(player.y + player.height > cam.innerBottomBoundary){
            cam.y = player.y + player.height - (cam.height * 0.75);
        }

        // ajuste nas coordenadas da câmera para se enquadrarem no layout total do labirinto
        cam.x = Math.max(0, Math.min(T_WIDTH - cam.width, cam.x));
        cam.y = Math.max(0, Math.min(T_HEIGHT - cam.height, cam.y));
    }

    function render(){ // representar graficamente os elementos do jogo
        ctx.clearRect(0,0,WIDTH,HEIGHT);
        ctx.save();
        ctx.translate(-cam.x, -cam.y);
        for(var row in maze){
            for(var column in maze[row]){
                var tile = maze[row][column];
                // coordenadas
                var x = column*tileSize; 
                var y = row*tileSize;
                //ctx.fillRect(x, y, tileSize, tileSize); // desenhar retângulo: coordenadas; dimensões
                ctx.drawImage(
                    img,
                    tile * tileSrcSize,0,tileSrcSize,tileSrcSize,
                    x, y, tileSize, tileSize
                );
            }
        }

        ctx.fillStyle="#00f";
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.restore();
    }

    function loop(){ // repete as demais funções de modo recursivo
        update();
        render();
        requestAnimationFrame(loop, cnv);
    }
}());