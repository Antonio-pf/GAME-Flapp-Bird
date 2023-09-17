
//cria uma imgem dentro da memoria e associa uma urla

const som = new Audio();
som.src = './efeitos/hit.wav';
const sprites = new Image();
sprites.src = './sprites.png';

let frames = 0;

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// menu

//telas
const globais = {};

let telaAtiva = {};

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const telas = {
    INICIO: {

        inicializa() {
            globais.flappyBird = criaFlappyBird()
            globais.chao = criaChao();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            menu.desenha();
        },

        click() {
            mudaParaTela(telas.JOGO);

        },
        atualiza() {

            globais.chao.atualiza();
        }

    }
}

telas.JOGO = {
    desenha() {
        planoDeFundo.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    },
    click() {
        globais.flappyBird.pula();

    },
    atualiza() {
        globais.flappyBird.atualiza();
    }
}
const menu = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            menu.spriteX, menu.spriteY,
            menu.largura, menu.altura,
            menu.x, menu.y,
            menu.largura, menu.altura,

        );

    },
};

//chao
function criaChao() {

    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,

        atualiza() {
            const movChao = 1;
            const repete = chao.largura / 2;
            const movimentacao = chao.x - movChao;

            chao.x = movimentacao % repete;

        },
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,

            );

            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,

            );
        },
    };
    return chao;
}


function fazColisao(flappyBird, chao) {

    const flappyBirdY = flappyBird.y + flappyBird.altura - 50;
    
    const chaoY = chao.y - 25;

    if (flappyBird.y >= chaoY) {
        return true;
    }
    return false;


}

// personagem
function criaFlappyBird() {

    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        },
        gravidade: 0.25,
        velocidade: 0,

        atualiza() {

            if (fazColisao(flappyBird, globais.chao)) {

                som.play();

                setTimeout(() => {
                    mudaParaTela(telas.INICIO)


                }, 500);
                return;

            }
            flappyBird.velocidade = flappyBird.velocidade + this.gravidade
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio 
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio 
          ],

        frameAtual: 0,

        atualizaOFrame() {
            const inicio = 1;
            const incremento = inicio + flappyBird.frameAtual;
            const baseRepeticao = flappyBird.movimentos.length;
            flappyBird.frameAtual = incremento % baseRepeticao;

        },
        desenha() {
            flappyBird.atualizaOFrame()
            const {spriteX, spriteY} = flappyBird.movimentos[flappyBird.frameAtual];
            contexto.drawImage(
                sprites,
                spriteX, spriteY,
                flappyBird.largura, flappyBird.altura,
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,

            );

        },
    };

    return flappyBird;

}


// plano de fundo

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce'
        contexto.fillRect(0, 0, canvas.width, canvas.height)
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,

        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,

        );

    },
};

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames ++;

    requestAnimationFrame(loop);

}

window.addEventListener('click', function () {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(telas.INICIO)
loop();
