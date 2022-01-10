let engine = {
    "cores":['green','purple', 'pink', 'red', 'yellow', 'orange', 'gray', 'black', 'blue', 'white', 'gold' ],
    "hexadecimais":{
        'green': '#02EF00',
        'purple': '#790093',
        'pink': '#FFC0CB',
        'red': '#FF0000',
        'yellow': '#E7D703',
        'orange': '#FFA500',
        'gray': '#BEBEBE',
        'black': '#000000',
        'blue': '#0000FF',
        'white': '#FFFFFF',
        'gold': '#FFD700',
    },
    "pontuacao" : 0
}

const audioAlegria = new Audio('/audio/alegria.mp3');
const audioChoro = new Audio('/audio/choro.mp3');
let speechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const GRAVADOR = new speechAPI();
GRAVADOR.continuous = false;
GRAVADOR.lang = 'en-US';
GRAVADOR.interimResults = false;
GRAVADOR.maxAlternatives = 1 ;
let btnGravador = document.getElementById('btn-responder');
const CAIXA_DAS_CORES = document.getElementById('caixa');
let legendaCorDaCaixa = document.getElementById('cor-legenda');
let pontuacao = document.getElementById('pontuacao-atual');

let tituloAcertouErrou = document.querySelector('#title-result');
let transcricaoIntoText = document.getElementById('result-audio');
const DIV_CENTRAL = document.getElementById('center');
let btnNext = document.getElementById('btn-next-color');
let divDireita = document.getElementById('direita');
let divEsquerda = document.getElementById('esquerda');
const IMG_CONTAINER_DIREITA = document.querySelector('#img');

function main(){
    aplicarCorNaCaixa(sortearCor());

    btnGravador.addEventListener('click', function(e){
        GRAVADOR.start() ;
        
    });

    GRAVADOR.onstart = function (){
        btnGravador.innerText = "ESTOU OUVINDO";
        btnGravador.style.backgroundColor = 'white';
        btnGravador.style.color = 'black';
        btnGravador.style.borderColor = legendaCorDaCaixa.innerText;
    }  

    GRAVADOR.onspeechend = function (){
        btnGravador.innerText = "RESPONDER";
        btnGravador.style.backgroundColor = 'transparent';
        btnGravador.style.color = 'white';
        btnGravador.style.borderColor = 'inherit';
    }
        
    GRAVADOR.onresult = function (event){
        let transcricaoAudio = event.results[0][0].transcript.toUpperCase(); 

        if (DIV_CENTRAL.style.display = 'none'){
            DIV_CENTRAL.style.display = 'flex';
        }
        
        if(legendaCorDaCaixa.innerText == transcricaoAudio){
            atualizarPontuacao(1);
            aplicarCorNaCaixa(sortearCor());
            quandoAcertar();
            conteudoAposResultAcertou(transcricaoAudio);
        }else{
            atualizarPontuacao(-1);
            aplicarCorNaCaixa(sortearCor());
            quandoErrar();
            conteudoAposResultErrou(transcricaoAudio);
        }  
        
        btnNext.addEventListener('click', function(){
            aplicarCorNaCaixa(sortearCor());
            if (DIV_CENTRAL.style.display = 'flex'){
                DIV_CENTRAL.style.display = 'none';
            }else{
                DIV_CENTRAL.style.display = 'flex';
            }
            
        });
    }   
}

function sortearCor(){
    let indexCorSorteada = Math.floor(Math.random() * engine.cores.length);
    let nomeCorSorteada = engine.cores[indexCorSorteada];

    legendaCorDaCaixa.innerText = nomeCorSorteada.toUpperCase();
    return engine.hexadecimais[nomeCorSorteada];
}

function aplicarCorNaCaixa(nomeDaCor){
    CAIXA_DAS_CORES.style.backgroundColor = nomeDaCor;
}

function atualizarPontuacao(valor){
    valor < 0 ? audioChoro.play() : audioAlegria.play();  
    engine.pontuacao += valor;
    pontuacao.innerText = engine.pontuacao;
}

function verificarCompatibilidadeNavegador(){
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) return Window.alert('Seu Navegador não possui suporte para o site');
}
// RESULTADO

function conteudoAposResultAcertou(transcript){
    tituloAcertouErrou.innerText  = "VOCÊ ACERTOU, VOCÊ PRONUNCIOU:";
    transcricaoIntoText.innerText = '"' +(transcript) + '"';  
    btnNext.innerText = "PRÓXIMA COR";
}

function conteudoAposResultErrou(transcript){
    tituloAcertouErrou.innerText  = "VOCÊ ERROU, VOCÊ PRONUNCIOU:";
    transcricaoIntoText.innerText = '"' +(transcript) + '"';  
    btnNext.innerText = "PRÓXIMA COR";
}

function configDivAcertou(){
    let srcImgErrou = '/img/joy.png';
    let className =  'img-result';
    let classNameBtnNext = 'btn-next';

    IMG_CONTAINER_DIREITA.setAttribute('src', srcImgErrou );
    IMG_CONTAINER_DIREITA.setAttribute('class', className );
    btnNext.setAttribute('class', classNameBtnNext);
}

function configDivErrou(){
    let srcImgAcertou = '/img/sadness.png';
    let className =  'img-result';
    let classNameBtnNext = 'btn-next';

    IMG_CONTAINER_DIREITA.setAttribute('src', srcImgAcertou);
    IMG_CONTAINER_DIREITA.setAttribute('class', className );
    btnNext.setAttribute('class', classNameBtnNext);
}

function quandoErrar(){
    configDivErrou();
}
function quandoAcertar(){
    configDivAcertou(); 
}

verificarCompatibilidadeNavegador();
main();

