const mongoose = require('mongoose')
module.exports = () => {
  mongoose.connect('mongodb://localhost:27017/movieappdbUSA', {useNewUrlParser: true, useUnifiedTopology: true});

  mongoose.connection.on('open',()=>{console.log('mongodb conncetion is success')})
  mongoose.connection.on('error',(err)=>{console.log('mongo db connection failed', err)})
}