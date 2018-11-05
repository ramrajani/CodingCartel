const express = require('express'),
      app     = express(),
      request = require('request');

function clientsid(){
    console.log("I m working");
    
var promise1 =Promise.resolve(require('../access.js').client_token());
var promise2 =Promise.resolve('everything done');
var promise3=Promise.resolve(require('../access.js').got());
console.log("token in callme   ");

    promise1.then(function(){
        return promise2}).then(function(){
            return promise3;
        }).then(values=>{
            console.log("i survived "+values);
            return values;});
    

}
try{
    clientsid();

}catch(e){
    console.log(e);
}
try{
    setInterval(clientsid,2700000);
}catch(e){

}

//2700000
      /* function gettoken(){
          var token;
          return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                console.log("inside get token");
                 var access_token =
                 console.log("again in callme");
                 console.log(access_token);
                 token=access_token; 
                 const error = false;
                 if(!error){
                     resolve();
                 }else{
                     reject('some error occured');
                 }
                },2000);    
    


          })
           
      } */



    

  











