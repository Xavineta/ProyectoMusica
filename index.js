const db = require("./db.js")
const {altaUsuario} = require("./db");

async function aplicacionMusica() {
    await db.conectar()

    const artista= await db.altaArtista({
        nombre:["Freddie,brian,jhonn"],
        generos:["Rock","Rock Clásico"],
        banda:""
    })
    console.log("Se creó un artista")
    console.log(artista)


    await artista.agregarBanda("Queen")
    console.log("Se agregó una banda al artista")
    console.log(artista)

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


    //Llamada a buscar usuario y que me encuentre
    // const usuarioEncontrado=await usuario.buscarPorNombreDeUsuario("Mondongo3")
    // if (usuarioEncontrado) {
    //     console.log("Se encontró a : "+usuarioEncontrado)
    // } else {
    //     console.log("No se encontró a nadie")
    // }
    // await db.desconectar
}

aplicacionMusica()