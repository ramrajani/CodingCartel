const express    = require('express'),
      app        = express(),
      morgan     = require('morgan'),
      callme     = require('./api/myapi/callme.js'),
      access     = require("./api/access"),
      mongotopic = require("./database/topic.js"),
      User       = require("./database/user.js"),
      passport   = require('passport'),
      LocalStrategy =require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      bodyParser  = require('body-parser'),
      methodOverride  = require("method-override"),
      subscription     = require('./api/myapi/subscription.js'),
      sendschedule     = require("./api/schedulemp");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method")); 
app.use(require('express-session')({
    secret:"RSquare Corporation will be there soon",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.static(__dirname + '/styles'));
app.use(morgan('combined'));



//  isloggedIn function -- checking for user logged in using session



function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
// -----------------------------------------------------------------------------------------------
// Routes

// index page route
app.get("/",function(req,res){
    mongotopic.find({"title":'datastructures'},{"subtitle":{ $elemMatch: { "name":"array" }}},function(err,topic){
        if(err){

            console.log("error occured!!");
            res.send("error occured");
        }else{
            console.log(topic);
            res.render("index",{topic:topic,CurrentUser:req.user});
        }
    })
});

// show profile 
app.get("/profile",isLoggedIn,function(req,res){

    res.render("profile",{CurrentUser:req.user});
    
})
//edit profile
app.get("/editprofile",isLoggedIn,function(req,res){
    res.render("editprofile",{CurrentUser:req.user});
});
// show compiler
app.get("/compiler",function(req,res){
  res.render("compiler",{CurrentUser:req.user});
});
// show contests
app.get("/contests",function(req,res){
    res.render("contests",{CurrentUser:req.user});
});
// show login page
app.get("/login",function(req,res){
    res.render("login",{CurrentUser:req.user});
});
//show sign up page
app.get("/signup",function(req,res){
    var passedvariable = req.query.valid;
    console.log("-------------------------------------------");
    console.log(passedvariable);
    console.log("-----------------------------------------------");
   res.render("register",{CurrentUser:req.user,Username:passedvariable});
});
// show signup with codechef 
app.get("/signup2",function(req,res){
    res.render("signup",{CurrentUser:req.user});
});
//show problem page
app.get("/problems",function(req,res){
    res.render("problempage",{code:req.query.code,CurrentUser:req.user});
})
//show contest details page
app.get("/contestdetails",function(req,res){
    res.render("contestdetails",{CurrentUser:req.user});
})
// view user code 
app.get("/user/code/:codenum",isLoggedIn,function(req,res){
    
      var username = req.user.username;
      var code = req.params.codenum;



})
// show friend profile
app.get("/usernamedb",function(req,res){
    var username=req.query.username;
    User.find({username:username},{"username":1,"fullname":1,"_id":0,"organization":1},function(err,user){
      if(!err){
        console.log(user);
        res.render("friend",{FriendUser:user,CurrentUser:req.user});


      }else{
          res.redirect("/");
      }         });

});
// render user saved code
app.get("/usercode",isLoggedIn,function(req,res){

    var problemcode = req.query.problemcode;
    console.log(problemcode);
    res.render("userscode",{CurrentUser:req.user,problemcode:problemcode});
});

//   Login routes using passport
// register route 
app.post("/register",function(req,res){



   User.register(new User({ image:req.body.url,
    username:req.body.username,
    fullname:req.body.fullname,
    country :req.body.country,
    city:req.body.city,
    state:req.body.state,
    occupation:req.body.occupation,
    organization:req.body.organization,
    band:req.body.band,
    emailid:req.body.email
                        }),req.body.password,function(err,user){
               if(err){
                   console.log(err);
                   return res.render("register");
               }
               passport.authenticate("local")(req,res,function(){
                     access.client_token();
                     res.redirect("/profile");
               });
   });

});
// login route
app.post("/login",passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/login"
}),function(req,res){


});
// logout route
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});


//-------------------------------------------------------------------
 //send a message
app.get("/sendmessage",function(req,res){
    console.log("--------------------------------");
    console.log(req.query);
    console.log(req.user);
    console.log("--------------------");
    User.update(
        { username: req.user.username }, 
        { $push: { messages: req.query } },
        function(err,data){
            console.log(data);
        }
    );
    User.update(
        { username: req.query.friend }, 
    { $push: { messages:{friend:req.user.username,msg:req.query.msg,status:"received"}  } },
        function(err,data){
            console.log(data);
        }
    );
    res.send("update successful"); 
    
});
//save my problem
app.get("/saveproblem",function(req,res){
     
    

    User.update(
        { username: req.user.username }, 
        { $push: { problemsolved:{
            sourcecode:req.query.sourcecode,
            input:req.query.input,
            output:req.query.output,
            language:req.query.language,
            problemcode:req.query.problemcode,
            time: req.query.timer,
           problemnumber:0
         } } },
        function(err,data){
            if(err){
                console.log(err);
            }
            console.log(data);
        }
    );

    res.send("fjkj");

});
// profile update route
 app.put("/editprofile",isLoggedIn,function(req,res){
    
            console.log(req.body);
    User.findOneAndUpdate({username: req.user.username},
        {
            fullname: req.body.fullname,
             emailid: req.body.email,
             image: req.body.url,
             city: req.body.city,
             country: req.body.country,
             occupation: req.body.occupation,
             organization: req.body.organization
         
    },function(err,user){
        if(err)
            console.log(err);
        else{
            console.log(user)
            res.redirect("/profile");
        }
    })


});








//---------------------------------------------------------------------------------
//api routes 

//school, easy, medium, hard, challenge, extcontest send as    ?cat=
app.get("/problems/api/category",access.category);
// get problems by ?tagname=
app.get("/problems/api/tags",access.tag);
//get contests details ?status=    past, present, future
app.get("/problems/api/contests",access.contests);
//get problem by code from ?code=
app.get("/problems/api/problemcode",access.problemcode);
//get contest details    ?code=
app.get("/problems/api/contestcode",access.contestcode);
//get list of languages on codechef
app.get("/problems/api/languages",access.languages);
//compile code with parameters  sourceCode,language,input
app.get("/problems/api/compilecode",access.compilecode);
//get all users from database
app.get("/problems/api/userdatabase",function(req,res){
    
    User.find({}).select({ "fullname": 1, "username": 1}).exec(function (err, someValue) {
        if (err) return next(err);
        console.log(someValue);
        res.send(someValue);
    });

});
//phone number subscription
app.get("/problems/api/suscribephone",subscription.phonesave);
//email id registration
app.get("/problems/api/subscribeemail",subscription.emailsave);



// call back route
app.get("/callback",access.clientautho,function(req,res){
    var codechefuser = JSON.parse(req.bodyuser);
    console.log("-------------------------------------------");
    console.log(codechefuser);


    console.log("I m in app..js");


    var userinside = codechefuser.result.data.content;
    console.log(userinside.username);
    User.find({username:userinside.username},function(err,user){
        
       if(!err){
           if(user.length==0){

            var  stringtosend = encodeURIComponent(JSON.stringify(userinside));
                res.redirect("/signup?valid="+stringtosend);
           }else{
          
           res.redirect("/login");
            }
       }
    });

    console.log("---------------------------------------");
 
   

   
});

// render datat from database
app.get("/data",function(req,res){

     console.log(req.query.topic);
     console.log(req.query.subtopic);
     mongotopic.find({"title":req.query.topic},{"subtitle":{ $elemMatch: { "name":req.query.subtopic }}},function(err,topic){
         if(err){
             console.log(err);
         }else{
             console.log(topic);
             if(topic.length==0){
                 res.send("404:page not found");
             }else{
                res.render("index",{topic:topic,CurrentUser:req.user});
             }
            
         }
     })


})

//scheduling code for email subscibtion
sendschedule.sensubscribe();



app.listen(3000,function(req,res){
  
    console.log("server has started");

});