const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codepiedb',{ useNewUrlParser: true });

const Schema = mongoose.Schema;

 
const phonesubscribeSchema = new Schema({
  
    phone:String
  
});

const Phonesubscribe = mongoose.model('Phonesubscribe', phonesubscribeSchema);


module.exports = Phonesubscribe;
