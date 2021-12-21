const mongoose = require("../database/index");

const PostSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    imagem: {
        type: String
    },
    texto: {
        type: String
    }
}, 
    {
        toJSON: {
            virtuals: true
        }
    }
);

const Post = mongoose.model('Post', PostSchema)

module.exports = Post