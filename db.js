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
        },
        individualONo: {
            type: Boolean,
            required: true
        }
    },
    {
        statics: {
            artistaSinBanda() {
                //Todos los artistas que no tengan
                return this.find({banda: {$exists: true, $eq: ""}})
            }
        },
        //Métodos de instancia
        methods: {
            async eliminarGenero(genero) {
                for (var i = 0; i < this.generos.length; i++) {
                    if (this.generos[i] === genero) {
                        this.generos.splice(i, 1)
                        break;
                    }
                }
                await this.save()
            },
            async agregarBanda(banda) {
                this.banda = banda
                await this.save()
            }
        },
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
            type: String,
            required:true
        },
        canciones: [
            {
                nombre: {
                    type: String,
                    required: true,
                },
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
            async cambiarPassword(passwordChanged) {
                try {
                    this.password = passwordChanged
                    await this.save()
                    console.log("Contraseña actualizada correctamente")
                } catch (e) {
                    throw new Error(`No se pudo cambiar la contraseña de forma correcta: ${e}`)
                }
            },
        },
        query: {}
    },
)

const Usuario = mongoose.model("Usuario", usuarioSchema)
const Artista = mongoose.model("Artista", artistaSchema)

//Middleware
//Usuario
usuarioSchema.pre('validate', function () {
    //Comprobar que se han introducido al menos dos album
    if (this.albums.length < 2) {
        throw new Error("Error, debe introducir al menos dos album")
    }
})

//Post
artistaSchema.post('deleteOne', function (doc) {
    console.log('%s ha sido borrado', doc._id)
})

//Métodos estáticos

//Usuario.
usuarioSchema.statics.buscarPorNombreDeUsuario = async function (loginusuario) {
    // return Usuario.where('login', loginusuario)
}

exports.buscarPorNombreDeUsuario= async function(loginusuario) {
    return await  Usuario.buscarPorNombreDeUsuario(loginusuario)
}


//Query
exports.contarTotalGenerosPorNombre = async function (nombreGenero) {
    return Artista.countDocuments({generos: {$in: [nombreGenero]}})
}

//Query
//Mostrar el nombre de los artistas que tengan a false si son inviduales
exports.nombresDeArtistas = async function () {
    return  artistas = await Artista.find({individualONo: false}).select("nombre").exec()
}

exports.altaArtista = async function (datosArtista) {
    return Artista.create(datosArtista);
}

exports.altaUsuario = async function (datosUsuario) {
    return Usuario.create(datosUsuario);
}
//Métodos propios de la BD

exports.desconectar = mongoose.disconnect()

exports.conectar = async function () {
    await mongoose.connect('mongodb://127.0.0.1:27017/appMusica')
}

