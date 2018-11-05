const auth = require('../config/auth.json');
var Contestsubscribe = require("../database/sendsubsciption");
const request = require('request');
var utf8 =require('utf8');
var tokenrequested="";

function gettoken(value){
    console.log("success "+value);
    tokenrequested=value;
    console.log("token requested "+tokenrequested);
   
}


module.exports = {
    // client credentials token
    client_token: function(){

      request({
            url:'https://api.codechef.com/oauth/token',
            method:'POST',
            form:{
                "grant_type":"client_credentials",
                "scope":"public",
                "redirect_uri":"http://149.129.138.187:3000/callback",
                client_id:auth.client_id,
                client_secret:auth.client_secret
            }
        },function(err,res){
            try{
                var json = JSON.parse(res.body);
                console.log(json.result.data.access_token);
              var token=json.result.data.access_token;
                console.log("============================");
                gettoken(token); 
                
            }catch(e){
                console.log(e);
            }
               
        });       
                 
       
      
                     
    },

    got:function(){
        console.log(tokenrequested);
        return(tokenrequested);
    },
    //category     /problems/{categoryName}   
// school, easy, medium, hard, challenge, extcontest
category: function(req,res){
    var cat = req.query.cat;
    console.log("----------------------------------");
    console.log("in category "+tokenrequested);
    console.log("----------------------------------");
    var authorix = "Bearer "+tokenrequested;
    console.log(authorix);
   request({
        url:'https://api.codechef.com/problems/'+cat,
        method:'GET',
        headers: {
            "Authorization": authorix
          }
    },function(err,data){
        console.log(data);
        console.log(err);
        var json =JSON.stringify(data);
        res.send(json);
    });

},
// fetch problems by filter = tagname
tag:function(req,res){
    var authorix = "Bearer "+tokenrequested;
    var tagname = req.query.tagname;
    console.log(authorix);
   request({
        url:'https://api.codechef.com/tags/problems?filter='+tagname,
        method:'GET',
        headers: {
            "Authorization": authorix
          }
    },function(err,data){
        var json =JSON.stringify(data);
        res.send(json);
    });
},
// fetching problems by problem code with contestcode PRACTICE
problemcode:function(req,res){

    var authorix = "Bearer "+tokenrequested;
    var problemcode = req.query.code;
    console.log(authorix);
   request({
        url:"https://api.codechef.com/contests/PRACTICE/problems/"+problemcode,
        method:'GET',
        headers: {
            "Authorization": authorix
          }
    },function(err,data){
        var json =JSON.stringify(data);
        console.log(json);
        res.send(json);
    });

},

// new user sign up authentication
clientautho:function(req,res,next){

   var code =req.query.code;
   console.log(code);
   request({
    url:'https://api.codechef.com/oauth/token',
    method:'POST',
    form:{
        "grant_type":"authorization_code",
        "code": code,
        "redirect_uri":"http://149.129.138.187:3000/callback",
        client_id:auth.client_id,
        client_secret:auth.client_secret


    }
},function(err,data){

    console.log("----------------------------------------------------");
    console.log(data);
   
    var inbetween = JSON.parse(data.body);
    console.log(inbetween);
    var tokenvar =inbetween.result.data.access_token;
    console.log(tokenvar);
    var sendtoken = "Bearer "+tokenvar;
    request({
        url:"https://api.codechef.com/users/me",
        method:'GET',
        headers: {
            "Authorization": sendtoken
          }
    },function(err,data1){
        
          console.log(data1);
          req.bodyuser = data1.body;
          next();
    });
       
       console.log("----------------------------------------");
});     



},
// getting contests by filter present,past and future
contests:function(req,res){

    var authorix = "Bearer "+tokenrequested;
    var status = req.query.status;
    console.log(authorix);
   request({
        url:"https://api.codechef.com/contests?status="+status,
        method:'GET',
        headers: {
            "Authorization": authorix
          }
    },function(err,data){
        console.log(data);
     res.send(data);
    });

},

// get details of each contest by contest code
contestcode:function(req,res){

    var authorix = "Bearer "+tokenrequested;
    var contestcd = req.query.code;
    console.log(authorix);
   request({
        url:"https://api.codechef.com/contests/"+contestcd,
        method:'GET',
        headers: {
            "Authorization": authorix
          }
    },function(err,data){
        res.send(data);
    });

},
// fetching all languages
languages: function(req,res){

    var authorix = "Bearer "+tokenrequested;
   request({
        url:"https://api.codechef.com/language?limit=100",
        method:'GET',
        headers: {
            "Authorization": authorix
          }
    },function(err,data){
        res.send(data);
    });

},
// compiling code
compilecode:function(req,res){
    var sourceCode = req.query.sourceCode;
    var language = req.query.language;
    var input = req.query.input;
    var authorix = "Bearer "+tokenrequested;
  console.log("inside compilecode");
   console.log("-------------------------------");
  console.log(sourceCode+"  "+language+"  "+" "+input);
  console.log("------------------------------");
  console.log(req.body);
  console.log("------------------------");
    request({
        url:'https://api.codechef.com/ide/run',
        method:'POST',
        headers: {
            "Authorization": authorix
          },
        form:{
            "sourceCode":sourceCode,
            "language": language,
            "input":input,
            }
    },function(err,data){
        console.log(err);
        console.log("--------------------");
        console.log(data);
        console.log("----------------------------------------------------");
        var json = JSON.parse(data.body);
       var link =json.result.data.link;
       console.log(link);
                    request({
                        url:"https://api.codechef.com/ide/status?link="+link,
                        method:'GET',
                        headers: {
                            "Authorization": authorix
                        }
                    },function(err,data){
                        console.log(data);
                        res.send(data);
                    });
 
    });     
                    

},
//  code to scheduling email and phone subscription
schedulecontest:function(){
      
    var authorix = "Bearer "+tokenrequested;
    var status = "future";
    console.log(authorix);
   request({
        url:"https://api.codechef.com/contests?status="+status,
        method:'GET',
        headers: {
            "Authorization": authorix
          }
    },function(err,data){
  console.log("---------------------------------------------"); 
  var json = JSON.parse(data.body);
        console.log(json);
         try{
         var condetail = json.result.data.content.contestList;
         condetail.forEach(function(contest){

               Contestsubscribe.findOneAndUpdate({code:contest.code}, contest, { upsert: true, new: true, setDefaultsOnInsert: true }, function(error, result) {
                if (error) return;
               console.log(result);
                // do something with the document
            });

         })
         }catch(e){
             console.log(e);
         }
        console.log("-----------------------------------------------");

    });





}
      
    
 

}
