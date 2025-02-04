///Primeira recarga da função para buscar as notas. Útil quando recarrega.
buscaNotas();

import { Nota } from './model/nota_model.js';

///Deixando as funções globais
window.deletaNota = deletaNota;
window.editaNota = editaNota;

document.querySelector('.btn-salver').addEventListener('click', salvarNota);

var notaAEditar = null;

function salvarNota() {
    if (notaAEditar != null) {
        console.log('Editando');
        const titleValue = document.getElementById('camptitle').value;
        const messageValue = document.getElementById('campMensagem').value;

        notaAEditar.titulo = titleValue;
        notaAEditar.texto = messageValue;
        salvarLocalStorage(notaAEditar);
        buscaNotas();
        notaAEditar = null;

    } else {
        console.log('NOVO');
        const titleValue = document.getElementById('camptitle').value || 'Título Padrão';
        const messageValue = document.getElementById('campMensagem').value || 'Mensagem Padrão: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus ac libero';
        const nota = new Nota(gerarIdAutomatico(), titleValue, messageValue);
        salvarLocalStorage(nota);
        buscaNotas();
    }

}

function deletaNota(id) {
    const confirmDelete = confirm('Deseja realmente excluir esta nota?');
    if (confirmDelete) {
        console.log('Deletando nota com id:', id);
        localStorage.removeItem(id);
        buscaNotas();
    }
}

function editaNota(id) {

    estilizarCardEBotao('Editar');

    const nota = buscaNotasById(id);
    if (nota instanceof Nota) {
        document.getElementById('camptitle').value = nota.titulo;
        document.getElementById('campMensagem').value = nota.texto;
        notaAEditar = nota;
    }
}

function estilizarCardEBotao(type) {

    const botaoPrincipal = document.getElementById('botao-card-principal'); 
    const cardNew = document.getElementById('new-card'); 
    const titleCard = document.getElementById('title-card');

    switch (type) {
        case 'Novo':
            botaoPrincipal.innerText = 'Novo';
            botaoPrincipal.style.backgroundColor = 'Green';
            botaoPrincipal.style.color = 'white';
            cardNew.style.backgroundColor = 'aliceblue';
            titleCard.innerHTML = 'Nova Nota'; 

            document.getElementById('camptitle').value = '';
            document.getElementById('campMensagem').value = '';
            break;
        case 'Editar':
            botaoPrincipal.innerText = 'Editar';
            botaoPrincipal.style.backgroundColor = 'orange';
            botaoPrincipal.style.color = 'white';
            cardNew.style.backgroundColor = 'rgb(255, 236, 201)';
            titleCard.innerHTML = 'Editar Nota';
            break;
    }
}

function buscaNotasById(id) {
    const notaJson = JSON.parse(_localStorageGet(id));
    return Nota.fromJson(notaJson);
}

function buscaNotas() {
    estilizarCardEBotao('Novo');
    let notas = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== 'contadorColumnas') {
            const notaJson = JSON.parse(_localStorageGet(key));
            const nota = Nota.fromJson(notaJson);
            notas.push(nota);
        }

    }
    atualizarNotas(ordenarNotas(notas));
    return notas;
}


function ordenarNotas(notas) {
    const notasOrdenadas = notas.sort((a, b) => b.id - a.id);
    return notasOrdenadas;
}

function atualizarNotas(notas) {
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
                            <a data-id="${nota.id}" class="btn btn-warning", onclick="editaNota(${nota.id})">Editar</a>
                            <a data-id="${nota.id}" class="btn btn-danger", onclick="deletaNota(${nota.id})">Excluir</a>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(notaElement);
        }
    });
}


function _localStorageGet(key) {
    return localStorage.getItem(key);
}

function salvarLocalStorage(nota) {
    localStorage.setItem(nota.id, nota.toJson());
}

function gerarIdAutomatico() {
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