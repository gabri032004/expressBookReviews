const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const bodyParser = require('body-parser');

const app = new express;
app.use(bodyParser.json());

let users = [];



const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  var message='';
  var status; var exists=false;
  if(username && password){    
    let filtered_users = users.filter((user) => user.username === username);
      if (filtered_users.length > 0)  {
        let filtered_user = filtered_users[0];
        if( filtered_user.password==password){ 
          exists=true;
          console.log(username +' '+ password +' return true len '+ filtered_users.length)
        }else{
          exists=false;
          console.log('incorect password');
        }       
        
      }else{
        console.log(username +' '+ password +' return false fup '+filtered_users.password)
        exists=false;
      }  
  }else{
    status=401;
    exists=false;
  }
return exists;
}

//only registered users can login
regd_users.post("/login",bodyParser.json(), (req,res) => {
  //Write your code here
  const reguser = req.body;
  if(authenticatedUser(reguser.username,reguser.password)) {  
    const user=req.session.user=JSON.stringify(req.body);
    //const user=JSON.stringify(req.body);

    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });

      req.session.authorization = {
        accessToken
      }
     res.redirect('/');
  }else{
    return res.status(401).json({message:"invalid username or  password"});
  }
console.log(JSON.stringify(req.body,null,2));

});

// Add a book review
regd_users.put("/auth/review/:isbn", bodyParser.json(), (req, res) => {
  //Write your code here
  const bookReview = req.body;
  var count=Object.keys(books).length;
  const isbn = req.params.isbn;
  var status;  
  var objKeys=Object.keys(books);
  var objKeysR=Object.keys(books).reviews;
  var sessUser=JSON.parse(req.session.user) ;
  var search=false;
  var booksArr=[];
  
  console.log(bookReview);
  var filtered_book
  //console.log('sess user  '+ sessUser.username);
  
  if(Object.keys(bookReview).length>0){
    for(i=0; i<=count; i++ ){
      if(objKeys[i]===isbn){       
        search=true; 
          console.log('Book search ' + search);
           
          //check if revive for a particual exists for user
          booksArr[0]=booksArr.push(books[isbn]);
          filtered_book= booksArr.filter(obj =>obj.reviews  === sessUser.username);
          if(filtered_book.length>0){
              
              books[isbn].reviews.sessUser.username=bookReview.review;
              message='Book review updated successfully!'; status=200;
              booksArr=[];
              return res.status(status).json({message: message});
              console.log('Book review exists: Reviw updated');
              
          }  else{

              books[isbn].reviews=Object.assign(books[isbn].reviews,bookReview);               
              message=`New reveiw posted successfully! ${i} ${isbn}`; status=200;
              console.log(`new book ${i} review inserted `);
              booksArr=[];
              return res.status(status).json({message: message});            
              
          }
                  
      }
    }
  }else{
    return res.status(401).json('You must write something')
  } 
    
});

//Code for deleting book review
regd_users.delete("/auth/review/:isbn",  (req,res)=>{
  
    var count=Object.keys(books).length;
    const isbn = req.params.isbn;
    var status;  
    var objKeys=Object.keys(books);
    var objKeysR=Object.keys(books).reviews;
    var sessUser=JSON.parse(req.session.user) ;
    var search=false;
    var booksArr=[];
    
    //console.log(bookReview);
    var filtered_book; 
    var username=sessUser.username;
    
      for(i=1; i<=count; i++ ){
        if(objKeys[i]===isbn){       
          search=true; 
            console.log('isbn search found ' + search);
            
           console.log('username is: '+ username);
            delete books[isbn].reviews[username];
            console.log(books[isbn])
            res.status(200).json({message: 'review deleted successfully'})
                    
        }
      }
     
  
})

//Signup new user
regd_users.post("/signup/",bodyParser.json(), (req, res) => {
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

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
