let engine = {
  cores: [
    'green',
    'purple',
    'pink',
    'red',
    'yellow',
    'orange',
    'gray',
    'black',
    'blue',
    'white',
    'gold'
  ],
  hexadecimais: {
    green: '#02EF00',
    purple: '#790093',
    pink: '#FFC0CB',
    red: '#FF0000',
    yellow: '#E7D703',
    orange: '#FFA500',
    gray: '#BEBEBE',
    black: '#000000',
    blue: '#0000FF',
    white: '#FFFFFF',
    gold: '#FFD700'
  },
  pontuacao: 0
}

const audioAlegria = new Audio('./assets/audio-divertidamente/alegria.mp3')
const audioChoro = new Audio('/assets/audio-divertidamente/choro.mp3')
let speechAPI = window.SpeechRecognition || window.webkitSpeechRecognition
const GRAVADOR = new speechAPI()
GRAVADOR.continuous = false
GRAVADOR.lang = 'en-US'
GRAVADOR.interimResults = false
GRAVADOR.maxAlternatives = 1

let btnGravador = document.getElementById('btn-responder')
const CAIXA_DAS_CORES = document.getElementById('caixa')
let legendaCorDaCaixa = document.getElementById('cor-legenda')
let pontuacao = document.getElementById('pontuacao-atual')

let resultSection = document.getElementById('result')
let tituloAcertouErrou = document.getElementById('title-result')
let btnNext = document.getElementById('btn-next-color')
const imgResult = document.getElementById('img-result')

let btnSpeech = document.getElementById('btn-speech')

function main() {
  aplicarCorNaCaixa(sortearCor())

  btnGravador.addEventListener('click', function (e) {
    GRAVADOR.start()
  })

  GRAVADOR.onstart = function () {
    btnGravador.innerText = 'ESTOU OUVINDO'
    btnGravador.style.backgroundColor = 'white'
    btnGravador.style.color = 'black'
    btnGravador.style.borderColor = legendaCorDaCaixa.innerText
  }

  GRAVADOR.onspeechend = function () {
    btnGravador.innerText = 'RESPONDER'
    btnGravador.style.backgroundColor = 'black'
    btnGravador.style.color = 'white'
    btnGravador.style.borderColor = 'inherit'
  }

  GRAVADOR.onresult = function (event) {
    let transcricaoAudio = event.results[0][0].transcript.toUpperCase()

    if (legendaCorDaCaixa.innerText == transcricaoAudio) {
      resultSection.style.display = 'flex'
      result.classList.add('result')
      body.classList.add('scrollnone')
      atualizarPontuacao(1)
      quandoAcertar()
      conteudoAposResultAcertou()
    } else {
      resultSection.style.display = 'flex'
      result.classList.add('result')
      body.classList.add('scrollnone')
      atualizarPontuacao(-1)
      quandoErrar()
      conteudoAposResultErrou()
    }

    btnNext.addEventListener('click', function () {
      aplicarCorNaCaixa(sortearCor())
      resultSection.style.display = 'none'
      body.classList.remove('scrollnone')
    })
    btnSpeech.addEventListener('click', function () {
      pronunciarLegenda(legendaCorDaCaixa.innerText)
    })
  }
}

function sortearCor() {
  let indexCorSorteada = Math.floor(Math.random() * engine.cores.length)
  let nomeCorSorteada = engine.cores[indexCorSorteada]

  legendaCorDaCaixa.innerText = nomeCorSorteada.toUpperCase()
  return engine.hexadecimais[nomeCorSorteada]
}

function aplicarCorNaCaixa(nomeDaCor) {
  CAIXA_DAS_CORES.style.backgroundColor = nomeDaCor
}

function atualizarPontuacao(valor) {
  valor < 0 ? audioChoro.play() : audioAlegria.play()
  engine.pontuacao += valor
  pontuacao.innerText = engine.pontuacao
}

function verificarCompatibilidadeNavegador() {
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition)
    return Window.alert('Seu Navegador não possui suporte para o site')
}

// RESULTADO

function conteudoAposResultAcertou() {
  tituloAcertouErrou.innerText = 'Parabéns, você acertou!'
}

function conteudoAposResultErrou() {
  tituloAcertouErrou.innerText = 'Que pena, tente novamente.'
}

function setDivResult(acertouOuErrou) {
  let srcImgAcertou = './assets/img-divertidamente/joy.png'
  let srcImgErrou = './assets/img-divertidamente/sadness.png'
  let classNameImgResult = 'img-result'
  let classNameBtnNext = 'btn-next'
  let tituloResultado = 'title-result'

  if (acertouOuErrou == 'acertou') {
    imgResult.setAttribute('src', srcImgAcertou)
  } else {
    imgResult.setAttribute('src', srcImgErrou)
  }
  imgResult.setAttribute('class', classNameImgResult)
  tituloAcertouErrou.setAttribute('class', tituloResultado)
  btnNext.setAttribute('class', classNameBtnNext)
}

function quandoErrar() {
  setDivResult('errou')
}
function quandoAcertar() {
  setDivResult('acertou')
}

function pronunciarLegenda() {
  var msg = new SpeechSynthesisUtterance()

  msg.voiceURI = ''
  msg.volume = 2
  msg.rate = 0.7
  msg.text = legendaCorDaCaixa.innerText
  msg.pitch = 0.7
  msg.lang = 'en-US'
  speechSynthesis.speak(msg)
}

verificarCompatibilidadeNavegador()
main()
