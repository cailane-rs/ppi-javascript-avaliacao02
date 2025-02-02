///Primeira recarga da função para buscar as notas
_buscaNotas();


///Declarando as classes Nota
import { Nota } from './model/nota_model.js';

///Deixando as funções globais
window._deletaNota = _deletaNota;
window._editaNota = _editaNota;

///Evento para salvar a nota
document.querySelector('.btn-salver').addEventListener('click', _salvarNota);


var notaAtualiza = null;

// document.getElementById('campMensagem').value = nota.texto;

///Função para salvar a nota
function _salvarNota() {
    if (notaAtualiza != null) {
        console.log('Editando');
        const titleValue = document.getElementById('camptitle').value;
        const messageValue = document.getElementById('campMensagem').value;

        notaAtualiza.id;
        notaAtualiza.titulo = titleValue;
        notaAtualiza.texto = messageValue;
        _localStorageSave(notaAtualiza);
        _buscaNotas();
        notaAtualiza = null;

    } else {
        console.log('NOVO');
        const titleValue = document.getElementById('camptitle').value || 'Título Padrão';
        const messageValue = document.getElementById('campMensagem').value || 'Mensagem Padrão: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus ac libero';
        const nota = new Nota(_gerarIdAutomatico(), titleValue, messageValue);
        _localStorageSave(nota);
        _buscaNotas();
    }

}

///Função para deletar a nota
function _deletaNota(id) {
    const confirmDelete = confirm('Deseja realmente excluir esta nota?');
    if (confirmDelete) {
        console.log('Deletando nota com id:', id);
        localStorage.removeItem(id);
        _buscaNotas();
    }
}

///Função para editar a nota
function _editaNota(id) {

    ///Mudando o nome do botão e style 
    _styleButtonCard('Editar');

    const nota = _buscaNotasById(id);
    if (nota instanceof Nota) {
        document.getElementById('camptitle').value = nota.titulo;
        document.getElementById('campMensagem').value = nota.texto;
        // _localStorageSave(Nota(id, 'titulo', 'texto'));
        notaAtualiza = nota;
        console.log('-------------' + notaAtualiza)
    }
}

function _styleButtonCard(type) {

    const botaoPrincipal = document.getElementById('botao-card-principal'); 
    const cardNew = document.getElementById('new-card'); 
    const titleCard = document.getElementById('title-card');

    switch (type) {
        case 'Novo':
            ///Style Button 
            botaoPrincipal.innerText = 'Novo';
            botaoPrincipal.style.backgroundColor = 'Green';
            botaoPrincipal.style.color = 'white';
            cardNew.style.backgroundColor = 'aliceblue';
            titleCard.innerHTML = 'Nova Nota'; 

            document.getElementById('camptitle').value = '';
            document.getElementById('campMensagem').value = '';
            break;
        case 'Editar':
            ///Style Button 
            botaoPrincipal.innerText = 'Editar';
            botaoPrincipal.style.backgroundColor = 'orange';
            botaoPrincipal.style.color = 'white';
            cardNew.style.backgroundColor = 'rgb(255, 236, 201)';
            titleCard.innerHTML = 'Editar Nota';
            break;
    }
}

function _buscaNotasById(id) {
    const notaJson = JSON.parse(_localStorageGet(id));
    return Nota.fromJson(notaJson);
}

///Função para buscar as notas
function _buscaNotas() {

    _styleButtonCard('Novo');
    let notas = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== 'contadorColumnas') {
            const notaJson = JSON.parse(_localStorageGet(key));
            const nota = Nota.fromJson(notaJson);
            notas.push(nota);
        }

    }
    _renderNotas(_ordenaNotas(notas));
    return notas;
}


///Função para ordenar as notas
function _ordenaNotas(notas) {
    const _notas = notas.sort((a, b) => b.id - a.id);
    return _notas
}

///Função para renderizar as notas
function _renderNotas(notas) {
    const container = document.getElementById('list-notas-container');
    if (!container) {
        console.error('Container não esta registrando ');
        return;
    }
    container.innerHTML = '';
    notas.forEach(nota => {
        if (nota instanceof Nota) {
            const notaElement = document.createElement('div');
            notaElement.className = 'card';
            notaElement.innerHTML = ` 
                <div class="card-criados" style="width: 18rem;">
                    <img src="https://upload.wikimedia.org/wikipedia/pt/5/51/Logo_Bloco_de_Notas-pt.PNG" class="card-img-top" alt="...">
                    <div class="card-body">
                            <h5 class="card-title">${nota.titulo}</h5>
                            <p class="card-text">${nota.texto}</p>
                        <div>
                            <a data-id="${nota.id}" class="btn btn-warning", onclick="_editaNota(${nota.id})">Editar</a>
                            <a data-id="${nota.id}" class="btn btn-danger", onclick="_deletaNota(${nota.id})">Excluir</a>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(notaElement);

        }

    });
}


///Função para pegar o valor do localStorage
function _localStorageGet(key) {
    return localStorage.getItem(key);
}

///Função para salvar o valor no localStorage
function _localStorageSave(nota) {
    localStorage.setItem(nota.id, nota.toJson());
}

///Incrementador de ID
function _gerarIdAutomatico() {
    let id = localStorage.getItem('contadorColumnas');
    if (id === null) {
        id = 0;
    } else {
        id = parseInt(id);
    }
    id += 1;
    localStorage.setItem('contadorColumnas', id);
    return id;
}