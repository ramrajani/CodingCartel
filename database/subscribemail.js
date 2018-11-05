const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codepiedb',{ useNewUrlParser: true });

const Schema = mongoose.Schema;
 
const emailsubscribeSchema = new Schema({
  
    emailid:String
  
});

const Emailsubscribe = mongoose.model('Emailsubscribe', emailsubscribeSchema);


module.exports = Emailsubscribe;
