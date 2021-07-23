const mongoose = require('mongoose');

const uri = 'mongodb+srv://admin:shellter92@cluster0.sg54f.mongodb.net/orkutDatabase?retryWrites=true&w=majority'

mongoose.connect(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true 
})
mongoose.Promise = global.Promise

module.exports = mongoose;