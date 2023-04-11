(function(){
    var cnv = document.querySelector("canvas");
    var ctx = cnv.getContext("2d");
    // pixel do canvas
    var tileSize = 32;
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
    }

    function render(){ // representar graficamente os elementos do jogo
        ctx.clearRect(0,0,WIDTH,HEIGHT);
        ctx.save();
        for(var row in maze){
            for(var column in maze[row]){
                var tile = maze[row][column];
                if(tile === 1){
                    // coordenadas
                    var x = column*tileSize; // 32 -> pixels
                    var y = row*tileSize;
                    ctx.fillRect(x, y, tileSize, tileSize); // desenhar retângulo: coordenadas; dimensões
                }
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

    requestAnimationFrame(loop, cnv); // responsável pela primeira chamada à função loop
}());