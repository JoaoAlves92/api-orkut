const express = require('express')
const User = require("../models/user")
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/cadastro', async (req, res) => {
    const { email, senha, nome, statusRelacionamento } = req.body;

    try {
        if ( await User.findOne({ email }) ) {
            return res.status(400).send({'erro': 'usuario já cadastrado'})
        }
        const user = await User.create(req.body)

        user.senha = undefined

        const token = jwt.sign({
            id: user.id,
            nome: nome,
            email: email,
            statusRelacionamento: statusRelacionamento
        }, "tokensecretosuper", {
            expiresIn: 86400                   
        })
        res.set('Authorization', token)
        return res.send({ token })

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

    const token = jwt.sign({
        id: user.id,
        nome: user.nome,
        email: email,
        statusRelacionamento: user.statusRelacionamento
    }, "tokensecretosuper", {
        expiresIn: 86400                   
    })
    res.set('Authorization', token)
    return res.send({ token })
})

router.post('/me', async (req, res) => {
    const { authorization } = req.headers

    let token = (authorization.split(' '))[1]

    if (!token) {
        return res.send({msg: 'Nenhum token'})
    }

    const user = jwt.verify(token, 'tokensecretosuper')
    if (!user) {
        return res.status(400).send({'erro': 'Um erro foi encontrado'})
    }
    return res.status(200).send({ user })
})

module.exports = app => app.use('/auth', router)