const db = require("./db.js")
const {altaUsuario} = require("./db");

async function aplicacionMusica() {
    await db.conectar()

    // const artista= await db.altaArtista({
    //     nombre:["Mercyful Fate"],
    //     generos:["Canta"],
    //     banda:"",
    //     individualONo:false
    // })
    // console.log("Se creó un artista")
    // console.log(artista)
    //
    //
    // await artista.agregarBanda("Queen")
    // console.log("Se agregó una banda al artista")
    // console.log(artista)
    //
    // await artista.eliminarGenero("Rock")
    // console.log("Se eliminó un genero del artista")
    // console.log(artista)

    console.log("Se contaron: "+await db.contarTotalGenerosPorNombre("Rock"))

    const usuario=await  db.altaUsuario( {
        login:"Mondongo41",
        password:"12355622",
        canciones:[
            {nombre:"All day",fecha:"1992-02-01"}
        ],
        artistas:[
            {nombre:"queen"}
        ],
        albums:[
            {nombre:"No remorse",numeroCanciones:10}
        ]
    })
    console.log("Se creó un usuario")
    console.log(usuario)

    console.log("Nombres de artistas: ")
    console.log(await db.nombresDeArtistas())

    console.log(await db.buscarBandasQueEmpiezanPorLetra("M"))
}

aplicacionMusica()