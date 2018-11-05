var Phone = require("../../database/subscribephone.js");
var Email = require("../../database/subscribemail.js");
var way2smspass = require("../../config/auth.json").way2pass;
var way2api = require("../../config/auth.json").way2api;
var way2phone = require("../../config/auth.json").way2phone;
var sendgridapikey = require("../../config/auth.json").SENDGRID_API_KEY;
var request = require('request');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendgridapikey);





function sendmsg(msg,phonenumber){
 //   https://smsapi.engineeringtgr.com/send/?Mobile=9765529076&Password=ramvinodrajani&Message=hi&To=9765529076&Key=ramraJXMcqouLOe5WCQIH
    request({
        url:"https://smsapi.engineeringtgr.com/send/?Mobile="+way2phone+"&Password="+way2smspass+"&To="+phonenumber+"&Key=ramraJXMcqouLOe5WCQIH&Message="+msg,
        method:'GET',
        form:{
         //   "Key":"ramraJXMcqouLOe5WCQIH",
           // "Mobile":way2phone,
            //"Password":way2smspass,
            //"Message":msg,
            //"To":phonenumber
            
        }
    },function(err,data){
        console.log(err);
        console.log(data);
        
    });

}



module.exports ={

    phonesave:function(req,res){
        var phonetosave = req.query.phone+""; 
       console.log(phonetosave);
    Phone.findOneAndUpdate({phone:phonetosave}, {phone:phonetosave}, { upsert: true, new: true, setDefaultsOnInsert: true },function(err,phone){
        if(!err){
            console.log(phone);
            console.log(phone.phone);
        var msg ="CodingCartel \"You have been successfully registered\"";
        var phonenumber=phone.phone;
        sendmsg(msg,phonenumber);
        res.send("done");
        }
    });
    },
    emailsave:function(req,res){
        console.log(req.query);
        Email.findOneAndUpdate({emailid:req.query.emailid}, {emailid:req.query.emailid}, { upsert: true, new: true, setDefaultsOnInsert: true },function(err,email){
            if(!err){
                console.log(email);
                var msg ={
                    to: email.emailid,
                    from: 'codingcartel@gmail.com',
                    subject:' Registration successful',
                    html:'<strong>You have been registered succesfully for contest news letter</strong>'
                }
                sgMail.send(msg);
                  
            }
        })
    },
    emailschedule:function(value){

        Email.find({},{emailid:1,_id:0},function(err,email){
            if(!err){
                email.forEach(function(val){
                    console.log(val);
                    var msg ={
                        to: val.emailid,
                        from: 'codingcartel@gmail.com',
                        subject:'Notification for '+value.name,
                        html:'<strong>Coding contest Starting</strong><br>contest code:'+value.code+'<br> contest name:'+value.name+'<br>contest starts at :'+value.startDate+'<br>contest ends at:' +value.endDate+'<br>contest-link:<a href=https://www.codechef.com/'+value.code+'>Click here</a>'
                    }
                    sgMail.send(msg);
                    
                })
            }
        });
    },
    phoneschedule:function(value){
        Phone.find({},{phone:1,_id:0},function(err,phone){
            if(!err){
            
                phone.forEach(function(val){
                    var phonesubmsg = "<b>Coding Cartel</b>   Coding contest Starting contestname-"+value.name+"starts at-"+value.startDate+"<br>link:https://www.codechef.com/"+value.code;
                      request({
                        url:"https://smsapi.engineeringtgr.com/send/?Mobile="+way2phone+"&Password="+way2smspass+"&To="+val.phone+"&Key=ramraJXMcqouLOe5WCQIH&Message="+phonesubmsg,
                        method:'GET',
                        form:{
                         //   "Key":"ramraJXMcqouLOe5WCQIH",
                           // "Mobile":way2phone,
                            //"Password":way2smspass,
                            //"Message":msg,
                            //"To":phonenumber
                            
                        }
                    },function(err,data){
                        console.log(err);
                        console.log(data);
                        
                    });
                });
            }
        })
    }
}




