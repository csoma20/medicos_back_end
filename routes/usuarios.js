const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos } = require('../middlewares/validar-campos')

const router = Router();

const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-JWT');


router.get('/', validarJWT, getUsuarios)


router.post('/',

    [
        validarJWT,
        check('nombre', 'el nombre es obligatorio').not().isEmpty(),
        check('password').not().isEmpty(),
        check('email', 'el password es oblogatorio').isEmail(),
        validarCampos
    ],


    crearUsuario

);

router.put('/:id',

    [

        validarJWT,

        check('nombre', 'el nombre es obligatorio').not().isEmpty(),

        check('email', 'el password es oblogatorio').isEmail(),
        validarCampos
    ],

    actualizarUsuario)


router.delete('/:id',

    validarJWT,

    borrarUsuario)

module.exports = router;