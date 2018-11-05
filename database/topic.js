const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codepiedb',{ useNewUrlParser: true });

const Schema = mongoose.Schema;
 
const topicSchema = new Schema({
  title: String,
  subtitle:[{name:String,
    body: String,
    youtubelink:[String],
    tagname:[String]
  }]
  
});

const Topic = mongoose.model('Topic', topicSchema);


module.exports = Topic;
