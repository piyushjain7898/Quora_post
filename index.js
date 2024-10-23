const express = require("express");
const app = express();
const mysql = require("mysql2");
const path = require("path");
const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const { v4: uuidv4 } = require('uuid');
app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "sqlDatabase",
    password: "H@numanji789887",
  });

app.get("/posts",(req,res)=>{
    let p = "select * from  user";
    try{
        connection.query(p,(err,result)=>{
            if(err)throw err;            
            res.render("index.ejs",{result});
        })
    } catch(err){
        console.log(err);
        res.send("some error occur on database")
    }  
})

// edit route 
app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let p = `select * from user where id = '${id}'  `;
    try {
      connection.query(p, (err, result) => {
        if (err) throw err;
        let user = result[0];
        res.render("edit.ejs", { user });
        // console.log(user);
      });
    } catch (err) {
      console.log(err);
      res.send("some error occur in database");
    }
  });

  app.patch("/posts/:id",(req,res)=>{
    let { id } = req.params;
    let {content} = req.body;
    let p = `  update user set content = "${content}" where id = "${id}";  `;
    try {
      connection.query(p, (err, result) => {
        if (err) throw err;
        let user = result[0];
        res.redirect("/posts");
        // console.log(user);
      });
    } catch (err) {
      console.log(err);
      res.send("some error occur in database");
    }
  })

//   show route 
app.get("/posts/:id/show",(req,res)=>{
    let { id } = req.params;    
    let p = ` select * from user where id = '${id}' `;
    try {
      connection.query(p, (err, result) => {
        if (err) throw err;
        let user = result[0];
        res.render("show.ejs",{user});        
      });
    } catch (err) {
      console.log(err);
      res.send("some error occur in database");
    }
})

// add route 

app.get("/posts/add",(req,res)=>{
   res.render("add.ejs");
})
// post route 
app.post("/posts/add",(req,res)=>{
    let id = uuidv4();
    let {username : newUserName, content : newContent}=req.body;
    let q = `insert into user (id , username, content) values ('${id}','${newUserName}','${newContent}')`
   
    try{
        connection.query(q,(err,result)=>{
            if(err)throw err ;
            console.log(result)
            res.redirect("/posts");
        })
    }catch(err){
        console.log(err);
        res.send("some error occurs in database")
    }
})

// delete route 
app.delete("/posts/:id",(req,res)=>{
  let { id } = req.params;    
  let  p = `delete from user where id ='${id}'`;
  try{
    connection.query(p ,(err,result)=>{
      if(err)throw err;
      res.redirect("/posts");
    })

  }catch(err){
        console.log(err)
        res.send("some err occur in database")
  }
})

app.listen(8080,(req,res)=>{
    console.log("app is listing on port 8080");
})