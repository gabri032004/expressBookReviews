const axios = require('axios').default;
const express = require('express');
const bodyParser = require('body-parser');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const app = new express;
app.use(bodyParser.json());


public_users.post("/register",bodyParser.json(), (req,res) => {
  //Write your code here
  const reguser = req.body;
  var message='';
  var status;
  if(reguser.username && reguser.password){    
    let filtered_users = users.filter((user) => user.username === reguser.username);

    if (filtered_users.length > 0) {
      let filtered_user = filtered_users[0];
      status=401;
      message='user already exists';
     }else{
      users.push(reguser);
      console.log(users)
      status=401;
      message='user successfully registered';
     }  
  }else{
    status=401;
    message='You must provide username and password!';
  }
  return res.status(status).json({message: message});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here  
  let myPromise=new Promise((resolve,reject)=>{
    resolve(res.status(200).send(JSON.stringify(books)));
  })
  myPromise.then(req);
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

   //Write your code here  
   let myPromise=new Promise((resolve,reject)=>{

    var count=Object.keys(books).length;
    const isbn = req.params.isbn;
      var mytable ='<table><tr>';
      var td=''; var x;
      var objKeys=Object.keys(books);
      var search=false;
      for(i=1; i<=count; i++ ){
        if(objKeys[i]===isbn){     
          search=true;   
          x=i;
          resolve(res.status(200).send(books[x]));
        }
      }
    resolve(res.status(200).send(JSON.stringify(books)));
  })

  myPromise.then(req)
    .catch(err=>{
      reject(res.status(401).send(err));
    });

  
  //if(search){return res.status(200).send(books[x])}else{return res.status(401).send('Book not found')}
    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve,reject)=>{
    const author = req.params.author;
    var count=Object.keys(books).length;
        var mytable ='<table><tr>';
        var td=''; var search=false; var x;
        for(var i = 1; i <= count; i++) {   
          if(books[i].author==author){
            search=true;
            x=i;
            resolve(res.status(200).send(books[x]));
          }           
        } 
  })

  myPromise.then(req)
    .catch(e=>{
      reject(res.status(401).send(e));
    })
 
 //if(search){return res.status(200).send(books[x])}else{return res.status(401).send('Book not found')}
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  let myPromise=new Promise((resolve,reject)=>{
    const title = req.params.title;
    var count=Object.keys(books).length;
    var search =false; var x;
        var mytable ='<table><tr>';
        var td='';
        for(var i = 1; i <= count; i++) {   
          if(books[i].title===title){
            search=true; x=i;
            resolve(res.status(200).send(books[x]));
          }           
        } 
   })

   myPromise.then(req)
    .catch(e=>{
      reject(res.status(401).send(e));
    })
 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  var count=Object.keys(books).length;
  const isbn = req.params.isbn;
      var mytable ='<table><tr>';
      var td=''; var x;
  var objKeys=Object.keys(books);
  var search=false;

  for(i=1; i<=count; i++ ){
    if(objKeys[i]===isbn){       
      search=true; x=isbn;
    }
  }
  if(search){return res.status(200).send(books[x].reviews)}else{return res.status(401).send('Book not found')}
  
});

module.exports.general = public_users;
