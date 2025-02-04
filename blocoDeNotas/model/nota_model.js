export class Nota {
    constructor(id, titulo, texto) {
        this.id = id;
        this.titulo = titulo;
        this.texto = texto;
    }
 
    toString() {
        return `id:${this.id}, titulo:${this.titulo}, texto:${this.texto}`;
    }

    static fromJson(json) {
        return new Nota(json.id, json.titulo, json.texto);
    }
    
    toJson() {
        return JSON.stringify({
            id: this.id,
            titulo: this.titulo,
            texto: this.texto
        });
    }
} 