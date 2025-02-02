const btnBuscar = document.getElementById('buscar');
const chaveApi = '4d4d2c5a';
let listaFilmes = document.getElementById('listaFilmes');
let totalResultados = document.getElementById('totalResultados');
const imgNotFound = "https://i.pinimg.com/736x/b4/06/4b/b4064b83aa7e4b8f59b077cabf64c4ee.jpg";
const moviesNotFound = "https://http.cat/images/404.jpg";

function exibirFilmes(search) {
    search.forEach(objetoFilme => {
        console.log(`Filme: ${objetoFilme.Title}, imdbID: ${objetoFilme.imdbID}`);
        const filme = document.createElement('div');
        let imgUrl = objetoFilme.Poster === 'N/A' ? imgNotFound : objetoFilme.Poster;
        
        filme.innerHTML = 
            `
            <div class="card" style="width: 15rem;">
            <img src="${imgUrl}" class="card-img-top" alt="Poster de ${objetoFilme.Title}  width="100">
                <div class="card-body">
                <h5 class="card-title">${objetoFilme.Title}</h5>
                <p>Ano: ${objetoFilme.Year}</p>
                <a href="https://www.google.com/search?q=onde+assistir+${objetoFilme.Title}" class="btn btn-primary">Onde assistir</a>
                </div>
            </div>
            `;
        listaFilmes.appendChild(filme);
    });
}

function exibirTotal(quantidade) {
    if(quantidade > 10) {
        quantidade = 10;
    }
    totalResultados.innerHTML = `Total de resultados: ${quantidade} (máximo: 10)`;
}

function pesquisar() {
    listaFilmes.innerHTML = '';
    let titulo = document.getElementById('titulo').value;
    let url = `https://www.omdbapi.com/?apikey=${chaveApi}&s=${titulo}`;
    console.log(titulo);
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if(data.Response === 'True') {
            listaFilmes.style.justifyContent = "flex-start";
            exibirFilmes(data.Search)
            exibirTotal(data.totalResults);
        } else {
            console.log("retorno vazio");
            const divFilmeNotFound = document.createElement('div');
            listaFilmes.style.display = "flex";
            listaFilmes.style.justifyContent = "center";
            divFilmeNotFound.innerHTML = `<img src="${moviesNotFound}" class="img-movie-not-found" alt="Nenhum filme encontrado"  width="100">`;
            listaFilmes.appendChild(divFilmeNotFound);
        }
    })
    .catch(error => {
        console.log(`Error: ${error}`);
    });
}
    
btnBuscar.addEventListener('click', pesquisar);
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        pesquisar();
    }
});