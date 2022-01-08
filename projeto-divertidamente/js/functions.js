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
    "memorias" : 0
}

const audioAlegria = new Audio('/audio/alegria.mp3');
const audioChoro = new Audio('/audio/choro.mp3');
let speechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const GRAVADOR = new speechAPI();
GRAVADOR.continuous = false;
GRAVADOR.lang = 'en-US';
let btnGravador = document.getElementById('btn-responder');
const CAIXA_DAS_CORES = document.getElementById('caixa');
let legendaCorDaCaixa = document.getElementById('cor-legenda');
let pontuacao = document.getElementById('pontuacao-atual');

function main(){
    verificarCompatibilidadeNavegador();

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

    GRAVADOR.onend = function (){
        btnGravador.innerText = "RESPONDER";
        btnGravador.style.backgroundColor = 'transparent';
        btnGravador.style.color = 'white';
        btnGravador.style.borderColor = 'inherit';
    }
        
    GRAVADOR.onresult = function (event){
        let transcricaoAudio = event.results[0][0].transcript.toUpperCase(); 

        if(legendaCorDaCaixa.innerText == transcricaoAudio){
            atualizarMemorias(1);
        }else{
            atualizarMemorias(-1);
        }  
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

function atualizarMemorias(valor){
    valor < 0 ? audioChoro.play() : audioAlegria.play();  
    engine.memorias += valor;
    pontuacao.innerText = engine.memorias;
}

function verificarCompatibilidadeNavegador(){
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) return alert('Seu Navegador não possui suporte para o site');
}

main();

