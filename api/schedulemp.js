var Phone = require("../database/subscribephone.js");
var Email = require("../database/subscribemail.js");
var access =require("./access.js");
var schedule = require('node-schedule');
var subscription     = require('./myapi/subscription');
var Contestsubscribe =require('../database/sendsubsciption');


module.exports={
    sensubscribe : function (){
   
        var a = gettoday();
     var  perfor = schedule.scheduleJob("0 1 1 * * *",function(){
        
          access.schedulecontest();
        
    })
    
    var j = schedule.scheduleJob('0 2 1 * * *', function(){
       
       console.log(a);
        Contestsubscribe.find({startDate:{ $regex:a}},function(err,value){
            console.log("working herer")
            console.log(value);
            console.log(err);
                  if(err){
                      console.log(err);

                  }else{

                    value.forEach(function(val){
                          console.log(val);         
                        subscription.emailschedule(val);
                        subscription.phoneschedule(val);



                    })
                  }
     


        })

              
              console.log("worked in process getfuturedata");
              
        }

        
      );


}
}
function gettoday(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    
    if(dd<10) {
        dd = '0'+dd
    } 
    
    if(mm<10) {
        mm = '0'+mm
    } 
    var compdate = yyyy+"-"+mm+"-"+dd;
    return(compdate);
    



}


