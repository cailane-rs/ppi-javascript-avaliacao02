src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" ;integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
crossorigin="anonymous"
src="script.js"

let intervalo;
let startTime;
let elapsedTime = 0;
let rodando = false;
let countTime;
itemTimes = {};


//-------------------------------------------------------------- WANING
function atualizarCronometro() {
    const now = Date.now();
    const diff = now - startTime + elapsedTime;
    const milliseconds = parseInt((diff % 1000) / 1);
    const seconds = parseInt((diff / 1000) % 60);
    const minutes = parseInt((diff / (1000 * 60)) % 60);
    const hours = parseInt((diff / (1000 * 60 * 60)) % 24);

    const formattedTime =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
    countTime = formattedTime;
    document.getElementById('contador').innerText = formattedTime;
}

function iniciarCronometro() {
    if (!rodando) {
        startTime = Date.now();
        intervalo = setInterval(atualizarCronometro, 1);
        rodando = true;
    }
}

function pausarCronometro() {
    if (rodando) {
        SalvaTime(countTime);
        clearInterval(intervalo);
        elapsedTime += Date.now() - startTime;
        rodando = false;
    }
}

function zerarCronometro() {
    clearInterval(intervalo);
    elapsedTime = 0;
    rodando = false;
    document.getElementById('contador').innerText = '00:00:00:000';
}

document.getElementById('iniciar').addEventListener('click', iniciarCronometro);
document.getElementById('pausar').addEventListener('click', pausarCronometro);
document.getElementById('zerar').addEventListener('click', zerarCronometro);



document.addEventListener('keydown', function (event) {
    if (event.key === 'Backspace') { ///Botão de apagar
        zerarCronometro();
    }
    if (event.key === ' ') { //Sapce inicia e para
        if (rodando) { /// Se estiver rodando: ele chama a func de pausar
            pausarCronometro();
        } else { /// se não, ele da start
            iniciarCronometro();
        }
    }
});

function SalvaTime(countTime) {
    SavelocalStorage(countTime);
    RecuperaTodos();
}

function SavelocalStorage(valor) {
    const id = gerarIdAutomatico();
    localStorage.setItem(id, valor);
}

function RecuperaTodos() {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        items[key] = value;
    }
    itemTimes = items;
    atualizaAListaDeTimes();
}

//-------------------------------------------------------------- WANING
function atualizaAListaDeTimes() {
    const lista = document.getElementById('registros');
    lista.innerHTML = ''; // Limpa a lista antes de adicionar os itens
    for (const [key, value] of Object.entries(itemTimes)) {
        const listItem = document.createElement('li');
        if (key != 'contadorColumnas') { 
            listItem.textContent = `${key}: ${value}`;
            lista.appendChild(listItem);
        }
    }
}

///Incrementador de ID
function gerarIdAutomatico() {

    let id = localStorage.getItem('contadorColumnas');

    if (id >= 5) {
        localStorage.clear();
        id = 0;
    }

    if (id === null) {
        id = 0;
    } else {
        id = parseInt(id);
    }
    id += 1;
    localStorage.setItem('contadorColumnas', id);
    return id;
}