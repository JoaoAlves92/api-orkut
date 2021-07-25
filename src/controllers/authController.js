const express = require('express')
const User = require("../models/user")
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/cadastro', async (req, res) => {
    const { email } = req.body;

    try {
        if ( await User.findOne({ email }) ) {
            return res.status(400).send({'erro': 'usuario já cadastrado'})
        }
        const user = await User.create(req.body)

        user.senha = undefined

        return res.send({ user })
    } catch (erro) {
        return res.status(400).send("O seguinte erro foi encontrado: " + erro)
    }
})

router.post('/autenticar', async (req, res) => {
    const { email, senha } = req.body

    const user = await User.findOne({ email }).select('+senha')

    if (!user) {
        return res.status(400).send({ 'erro': 'usuário não encontrado'})
    }

    if (!await bcrypt.compare(senha, user.senha)) {
        return res.status(400).send({ 'erro': 'senha inválida' })
    }

    user.senha = undefined

    const token = jwt.sign({ id: user.id }, "tokensecretosuper", {
        expiresIn: 86400                   
    })

    return res.send({ user, token })
})

module.exports = app => app.use('/auth', router)