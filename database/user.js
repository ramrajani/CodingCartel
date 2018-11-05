var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.connect('mongodb://localhost/codepiedb',{ useNewUrlParser: true });
var passportLocalMongoose = require('passport-local-mongoose');
var UserSchema = new mongoose.Schema({
    image:String,
    username:String,
    password:String,
    fullname:String,
    country :String,
    city:String,
    state:String,
    occupation:String,
    organization:String,
    band:String,
    emailid:String,
    problemsolved:[{
        sourcecode:String,
        input:String,
        output:String,
        language:String,
        problemcode:String,
        time: String,
        problemnumber:Number
    }],
    friends:[String],
    messages:[{friend:String,msg:String,status:String}],
    token:String,
    albela:String

});

UserSchema.plugin(passportLocalMongoose);

module.exports =mongoose.model("User",UserSchema);


