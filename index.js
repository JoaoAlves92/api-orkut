const express = require('express');
const User = require("./src/models/user")

const app = express()

app.use(express.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req, res) => {
    return res.send('Api')
})

app.get('/:slug', async (req, res) => {
    const slug = req.params.slug
    const user = await User.findOne({ slug })
    return res.send({user})
})

require('./src/controllers/authController')(app)

app.listen(process.env.PORT || 3002, () => {
    console.log('servidor iniciado')
})