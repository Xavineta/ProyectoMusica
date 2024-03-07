const db = require("./db.js")

async function aplicacionMusica() {
    await db.conectar()

    const artista= await db.altaArtista({
        nombre:["Freddie Mercury,Brian May,John Deacon"],
        generos:["Rock","Rock Clásico"],
        banda:""
    })
    console.log("Se creó un artista")
    console.log(artista)


    await artista.agregarBanda("Queen")
    console.log("Se agregó una banda al artista")
    console.log(artista)

    //No me está borrando el genero. ¿Por qué?
    await artista.eliminarGenero("Rock")
    console.log("Se eliminó un genero del artista")
    console.log(artista)

    const usuario=await  db.altaUsuario( {
        login:"Mondongo3",
        password:"12345672",
        canciones:[
            {nombre:"All day",fecha:"1992-02-01"}
        ],
        artistas:[
            {nombre:"nirvana",individualONo:false}
        ],
        albums:[
            {nombre:"No remorse",numeroCanciones:10}
        ]
    })

    console.log("Se creó un usuario")
    console.log(usuario)

   await db.desconectar
}

aplicacionMusica()