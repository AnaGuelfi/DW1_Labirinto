(function(){
    var cnv = document.querySelector("canvas");
    var ctx = cnv.getContext("2d");

    var maze = [];

    function update(){ // atualizar elementos do jogo

    }

    function render(){ // representar graficamente os elementos do jogo

    }

    function loop(){ // repete as demais funções de modo recursivo
        update();
        render();
        requestAnimationFrame(loop, cnv);
    }

    requestAnimationFrame(loop, cnv); // responsável pela primeira chamada à função loop
}());