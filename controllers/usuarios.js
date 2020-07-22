const Usuario = require('../models/usuario');
const { response, request } = require('express');

const { validationResult } = require('express-validator')

const { generarJWT } = require('../helpers/jwt');

const bcrypt = require('bcryptjs')

const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google')

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    });

}



const crearUsuario = async(req, res = response) => {

    const { email, password, nombre } = req.body;



    try {

        const existeEmail = await Usuario.findOne({ email })

        if (existeEmail) {

            return res.status(400).json({
                ok: false,
                msg: 'El correo ya està registrado'
            });
        }

        const usuario = new Usuario(req.body)

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password);



        await usuario.save();

        // Generar el TOKEN 
        const token = await generarJWT(usuario.id)

        res.json({
            ok: true,
            usuario: usuario,
            token

        });

    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'

        })
    }



}

const actualizarUsuario = async(req, res = response) => {


    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);


        if (!usuarioDB) {

            return res.status(404).json({

                ok: false,

                msg: 'No existe usuario por id'

            });
        }

        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {




            const existeEmail = await Usuario.findOne({ email });

            if (existeEmail) {
                return res.status(400).json({

                    ok: false,
                    msg: 'Ya existe usuario'
                });

            }

        }


        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });


        res.json({
            ok: true,
            usuario: usuarioActualizado


        });


    } catch (error) {


        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'

        });


    };

}



const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {


        const usuarioDB = await Usuario.findById(uid);


        if (!usuarioDB) {

            return res.status(404).json({

                ok: false,

                msg: 'No existe usuario por id'

            });
        }

        await Usuario.findByIdAndDelete(uid);


        res.json({
            ok: true,
            msg: 'Usuario elimnado'


        });


    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'

        });

    }

}

module.exports = {

    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}