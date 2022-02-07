const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: '/uploads/'})
const fileUpload = require('express-fileupload')
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Nahidul37003:Sylhetinthebd@cluster0.d8lte.mongodb.net/Nahidul37003?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('Picture'))
app.use(fileUpload())
app.use(bodyParser.urlencoded({ extended: false }))
client.connect(err => {
  const collection = client.db("Amar-Fosol").collection("Data"); 
  const Account = client.db("Amar-Fosol").collection("Account"); 
  app.get("/Data",(req,res)=>{
    collection.find({})
   .toArray((err,document)=>{
     res.send(document)
   })
  })
  app.post("/add",(req,res)=>{
      const product = req.body;
      collection.insertOne(product)
      .then(result=>{
  
        

       })

  })
  app.post('/register',(req,res)=>{
    const product = req.body;
    // console.log(req.body)
    const{name,email,password}= req.body;
    Account.findOne({email:email},(err,user)=>{
      if(user){
        res.send('User alrady register')
      }
      else{
           res.send('Successfully registation')

        Account.insertOne(product)
      }
    })
  })

  app.post('/login',(req,res)=>{
 
    console.log(req.body)
    const{email,password_1}= req.body;
    Account.findOne({email:email},(err,user)=>{
      if(user){
        console.log(user)
       if(password_1===user.password_1){
         res.send({messages:'login success',user})
       }
       else res.send({messages: 'password/email didnt match'})
      }
      else{
        res.send({messages:'user not register'})
        // console.log('ser not registe')
      }
    })
  })

  app.post('/Addpicture',(req,res)=>{
    const file= req.files.file;
    const name = req.files.name;
    const email =  req.files.email;
    console.log(name,email,file)
    const filepath= `${__dirname}/Picture/${file.name}`;
    file.mv(filepath ,err=>{
      if(err){
        console.log(err)
        return res.status(500).send({msg:'Fild to upload image'});
      }
      return res.send({name: file.name , path: `/${file.name}`})
    })
    var newImg=fs.readFileSync(filepath);
    const encImg= newImg.toString('base64');
    var Img={
      contentType: req.files.file.mimetype,
      size: req.files.file.size,
      img: Buffer(encImg,'base64')
    }
  })

  app.delete('/delete/:id',(req,res)=>{
    const id=req.query.params;
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(res=>{
      res.redirect('http://localhost:3000')
      
    })
  
  })

  app.delete('/deleteuser/:id',(req,res)=>{
    const id=req.query.params;
    Account.deleteOne({_id: ObjectId(req.params.id)})
    .then(res=>{
    
    
    })
  
  })
  app.get("/Account",(req,res)=>{
    const email= req.query.email;
    // console.log(email)
    Account.find({email:email})
   .toArray((err,document)=>{
     res.send(document)
   })
  })
  app.get("/findProduct",(req,res)=>{
    const email= req.query.email;
    // console.log(email)
    collection.find({email:email})
   .toArray((err,document)=>{
     res.send(document)
   })
  })
  app.get("/userinfo",(req,res)=>{
    Account.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })


});


app.listen(5000);