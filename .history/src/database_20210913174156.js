//MongoDB
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true
})
    .then(db => console.log('BD MongoDB conectada'))
    .catch(err => console.error(err));

