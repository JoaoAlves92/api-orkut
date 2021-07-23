const mongoose = require("../database/index");
const bcrypt = require("bcryptjs");
const mongooseSlugPlugin = require('mongoose-slug-plugin');

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    senha: {
        type: String,
        required: true,
        select: false
    }
})

UserSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=nome%>'})
UserSchema.set('timestamps', true)

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.senha, 10);
    this.senha = hash.toString();

    next();
})

const User = mongoose.model('User', UserSchema)

module.exports = User