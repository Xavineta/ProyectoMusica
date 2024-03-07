//Conexión a mongoose en la DB
const mongoose = require('mongoose')

//1. ¿Que pasa con required?
//Creación de esquema
const artistaSchema = new mongoose.Schema({
        nombre: {
            type: [String],
            required: true,
        },
        generos: [String],
        banda: {
            type: String
        }
    },
    {
        //Métodos de instancia
        methods: {
            async eliminarGenero(genero) {

                for (var i = 0; i < this.generos; i++) {
                    if (this.generos[i] === genero) {
                        this.generos[i].splice(i, 1)
                        break;
                    }
                }
                await this.save()
            },
            async agregarBanda(banda) {
                this.banda = banda
                await this.save()
            }
        }
    }
)

const usuarioSchema = new mongoose.Schema({
        login: {
            type: String,
            required: true,
            validate: {
                validator: function (login) {
                    return (login.length >= 4 && login.length <= 10)
                },
                message: props => `${props.value}'Login no válido`
            },

        },
        password: {
            type: String, validate: {
                validator: function (passwordChanged) {
                    return (passwordChanged.length >= 8 && passwordChanged.length <= 20)
                },
                message: props => `${props.value}'Password no válido`
            }
        },
        canciones: [
            {
                nombre: String,
                // required: true,
                fecha: {
                    type: Date, validate: {
                        validator: function (fecha) {
                            return (fecha < Date.now())
                        }
                    },
                    message: props => `${props.value}'Fecha no válida`
                },

            }
        ],
        artistas: [
            {
                nombre: String,
                individualONo: {
                    type: Boolean,
                    // required: true
                }
            },
        ],
        albums: [
            {
                nombre: String,
                numeroCanciones: {
                    type: Number, validate: {
                        validator: function (numeroCanciones) {
                            return (numeroCanciones >= 2)
                        }
                    },
                    message: props => `${props.value}'Número de canciones no válido`
                },
            },
        ],
    }, {
        virtuals: {
            passwordTestSecurity: {
                get() {
                    if (this.password.length >= 7 && this.password.length <= 20) {
                        return "La contraseña es segura"
                    } else {
                        return "La contraseña no es del todo segura"
                    }
                }
            }
        },
        methods: {

//Error Handling in Method: In the cambiarPassword method, when catching errors from save(), it's a ' +
// good practice to provide more specific error messages or handle different error cases appropriately. ' +
// 'Currently, the error message just concatenates the caught error, which might not be
// informative enough for debugging or handling specific scenarios.


            async cambiarPassword(passwordChanged) {
                try {
                    this.password = passwordChanged
                    await this.save()
                    console.log("Contraseña actualizada correctamente")
                } catch (e) {
                    throw new Error(`No se pudo cambiar la contraseña de forma correcta: ${e}`)
                }
            },
        }
    },
)

const Usuario = mongoose.model("Usuario", usuarioSchema)
const Artista = mongoose.model("Artista", artistaSchema)

//Middleware

//Pre
//Artista
artistaSchema.pre('save', function () {
    //Antes de hacer el save, poner el nombre de los artista/s en mayúscula a
    for (let i = 0; i < artistaSchema.nombre.length; i++) {
        artistaSchema.nombre[i].toUpperCase();
    }
})
Usuario
usuarioSchema.pre('validate', function () {
    //Comprobar que se han introducido al menos dos album
    if (this.albums.length < 2) {
        throw new Error("Error, debe introducir al menos dos album")
    }
})

//Post usuario (futuras versiones)

//Post de artista
//No estoy sacando ningún documento de mongoose.
// usuarioSchema.post('init', function (doc) {
//     console.log('%s fue inicializado desde la BD', doc.id)
// })

//Métodos estáticos

//¿Diferencias entre static y statics?
//Artista
usuarioSchema.static.buscarPorNombreDeUsuario = async function (nombreUsuario) {
    return usuarioSchema.findOne({nombre: nombreUsuario})
}

//Usuario

artistaSchema.statics.editarArtista = async function (nombres, generos, banda) {

}


//Exports

exports.contarTotalGenerosPorNombre = async function (nombreGenero) {
    return Artista.countDocuments({nombre: nombreGenero})
}

exports.altaArtistafavorito = async function (nombre, individual) {
    this.nombre = nombre
    this.individualONo = individual
    //Hacer el save después para la comprobación
}


exports.altaArtista = async function (datosArtista) {
    return Artista.create(datosArtista);
}

//Métodos de usuario export
exports.altaUsuario = async function (datosUsuario) {
    return Usuario.create(datosUsuario);
}
//Métodos propios de la BD

exports.desconectar = mongoose.disconnect()

exports.conectar = async function () {
    await mongoose.connect('mongodb://127.0.0.1:27017/appMusica')
}

