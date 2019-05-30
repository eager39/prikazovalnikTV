const express = require('express')
var bodyParser = require("body-parser")
var cors = require('cors')
var mysql = require('mysql')
const app = express()
var conf = require('./config')
conf = new conf()
const fs = require('fs-extra')
var util = require('util')
var unzip = require('unzip');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

var connection = mysql.createConnection({
   host: 'localhost',
   user: conf.DBuser,
   password: conf.DBpass,
   database: conf.database,
   multipleStatements: true
})



connection.connect(function(err) {
   if (err) {
      console.log("Napaka v povezavi do baze");
   } else {
      console.log('You are now connected...')
   }

})
app.use(cors());
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(bodyParser.json({
   limit: '50mb'
}));



function checkTokenWithPromise(req){
   return new Promise((resolve, reject) => {
     var token = req.headers['authorization'];
     
     if (token) {
       jwt.verify(token, "asd", function(err, decoded) {
         if (err) {
           reject(err);
         } else {
           decoded= jwt.decode(token); 
           resolve(decoded.user);
         }
       });
     }
   });
 }


app.get('/video/:id',cors(), function(req, res) {
   var sql = "SELECT id,name,active,type FROM items WHERE name=? ";
  

   
   connection.query(sql,[req.params.id], function(err, results) {
       try{
      if (err) throw err
      if (results.length > 0) {
         const path = __dirname+'/upload/' + results[0].name;
         const stat = fs.statSync(path)
         const fileSize = stat.size
         const range = req.headers.range
         if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1] ?
               parseInt(parts[1], 10) :
               fileSize - 1
            const chunksize = (end - start) + 1
            const file = fs.createReadStream(path, {
               start,
               end
            })
            const head = {
               'Content-Range': `bytes ${start}-${end}/${fileSize}`,
               'Accept-Ranges': 'bytes',
               'Content-Length': chunksize,
               'Content-Type': 'video/mp4',
            }
            res.writeHead(206, head);
            file.pipe(res);
         } else {
            const head = {
               'Content-Length': fileSize,
               'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head)
            fs.createReadStream(path).pipe(res)
         }
      }
   }catch(error){
   console.log(error);
}
   });

});

app.get('/data',cors(), function(req, res) {

   var id=req.query.id
if(id=="all"){
   var sql = 'SELECT id,name,active,type,ord,duration FROM items WHERE active=1  ORDER BY type asc';
}else{
   var sql = 'SELECT id,name,active,type,ord,duration FROM items  WHERE active=1 and display in (?) ORDER BY type asc';
}
   var slike = [];
   var test=[]
   var data;
 //  var sql = 'SELECT id,name,active,type,ord,duration FROM items WHERE active=1 and display=? ORDER BY type asc';
   connection.query(sql,[id], function(err, results) {
      if (err) throw err
      data = results;
     
      var type;
      function getImage(image) {
         
        return new Promise((resolve, reject) => { 
          var imgPath = __dirname+"/upload/" + image.name;
         
             fs.readFile(imgPath, (err, buffer) => {
              if (err){
                 console.log(err)
                 reject(err);
              }  else resolve(buffer);
          });
          
          
      });
      }

      function getAllImages() {
         var promises = [];
         // load all images in parallel
         for (var i = 0; i < data.length; i++) {
            if(data[i].type=="image" || data[i].type=="pdf" || data[i].type=="multipart/related" || data[i].type=="html"){
               test.push(data[i])
               promises.push(getImage(data[i]));
            }
           
            
         }
        
         // return promise that is resolved when all images are done loading
         return Promise.all(promises);
      }

      getAllImages().then(function(imageArray) {
         
         for (var i = 0; i < imageArray.length; i++) {
       
            if(test[i].type=="image" || test[i].type=="pdf" || data[i].type=="multipart/related"||  data[i].type=="html"){
            
                slike.push({
               "slika": imageArray[i].toString("base64"),
               "name":test[i].name,
               "type":test[i].type,
               "ord":test[i].ord,
               "dur":test[i].duration
            })
            }
           
            
         }
         for(var j=0;j<data.length;j++){
            if(data[j].type=="video"){
               slike.push({
               "name":data[j].name,
               "type":data[j].type,
               "ord":data[j].ord,
               "dur":0
            })
            }else if(data[j].type=="text"){
               
               slike.push({
                  "naslov":JSON.parse(data[j].name).naslov,
                  "vsebina":JSON.parse(data[j].name).vsebina,
                  "type":data[j].type,
                  "ord":data[j].ord,
                  "dur":data[i].duration
               })
            }
            else if(data[j].type=="graph"){
               
               slike.push({
                  "graph":JSON.parse(data[j].data),
                  "columns":JSON.parse(data[j].columns),
                  "name":data[j].name,
                  "type":data[j].type,
                  "ord":data[j].ord,
                  "dur":data[j].duration,
                  "graph_type":data[j].graph_type
               })
            }
            
         }
         
       

         res.json(slike)
      }, function(err) {
         // an error occurred
      });




   });


});

app.post("/image",async function(request, response) {
   checkTokenWithPromise(request).then(async user => {
   if (!request.body.item.value) {
      response.json(false)
      return false;
   } var display=request.body.tvid
   var filename =display+ request.body.item.filename
   var image = request.body.item.value;
   var filetype = request.body.item.filetype;
   console.log(filetype)
   
   var customtype;
   var data=await getMaxOrd(display)
  var path="/upload/"
 
   if(filetype.includes("video")){
customtype="video"
   }else if(filetype.includes("image")){
     
      customtype="image"
   }else if(filetype.includes("pdf")){
      customtype="pdf"
   }
   else if(filetype.includes("multipart/related")){
      customtype="html"
   } else if(filetype.includes("htm")){
      customtype="html"
      
   }else if(filetype.includes("zip")){
      
      customtype="zip"
   }
   if(customtype!="zip"){

   
      try {
         
         fs.writeFile(__dirname+path + filename, image, "base64", function(err) {
            if (err) {
               
                response.json(false)
               return console.log(err);
              
            }
            var sql = "INSERT INTO items (name,active,type,display,ord) VALUES (?,?,?,?,?)";
            connection.query(sql, [filename, 1,customtype,display,data[0].currord], function(err, results) {
               
               if(!err){
                 
                 
               response.json(true);
               }else{
                  console.log(err)
                  response.json(false)
               }
               
            });
         });

      } catch (err) {
         console.log(err)
      }
   }
      if(customtype=="html"){
         fs.writeFile(__dirname+"/../src/assets/" + filename, image, "base64", function(err) {
            if (err) {
               
                response.json(false)
               return console.log(err);
              
            }
         });
      }
      if(customtype=="zip"){
        
var Readable = require('stream').Readable

const imgBuffer = Buffer.from(image, 'base64')

var s = new Readable()

s.push(imgBuffer)   
s.push(null) 
 
//s.pipe(fs.createWriteStream("zip.zip"));


         s.pipe(unzip.Extract({ path: __dirname+"/../src/assets/" }));
         response.json(true);
      }
  
   
   }, err => {
      console.log("No such user. Error: " + err);
    });
   

});
 function getMaxOrd(display){
   
   connection.query = util.promisify(connection.query)
   return new Promise(async function(resolve, reject) {
   var sql="SELECT max(ord)+1 as currord FROM items WHERE display=?"
   var result=await connection.query(sql,[display])
  
   if(result[0].currord==null){
      return resolve([{"currord":0}])
      
   }else{
      return resolve(result)
   }
  
   
   })

}

app.post("/addTVs",async function(request,response){
   checkTokenWithPromise(request).then(async user => {
   if(!request.body.name){
      response.status(400).json(false)
      return false;
   }

var name=request.body.name
var location=request.body.location
connection.query = util.promisify(connection.query)
var csql="SELECT count(id) as number FROM displays"
var result=await connection.query(csql)
if(result[0].number>=conf.maxtv){
   response.json(false)
}else{
   var sql = "INSERT INTO displays (name,location) VALUES (?,?)";

connection.query(sql, [name, location], function(err, results) {
   if(!err){
      response.status(200).json(true)
   }
})
}
}, err => {
   console.log("No such user. Error: " + err);
 });
})
app.post("/addGraph",async function(request,response){


   var graph=request.body.graph
   var columns=request.body.columns
   var id=request.body.id
   var name=request.body.name
   var graph_type=request.body.graph_type
  var data=await getMaxOrd(id)
 
   var type="graph"
   var sql1="INSERT INTO graphs (data,columns,name_graph,graph_type) VALUES (?,?,?,?)"
   var sql2 = "INSERT INTO items (name,type,active,display,ord,graph) VALUES (?,?,?,?,?,?)";
  
   async function runquery(){
      try {
   var result1 = await connection.query(sql1,[graph,columns,name,graph_type])
  var result2=await connection.query(sql2,[name,type,1,id,data[0].currord,result1.insertId])

  connection.query("COMMIT")
  response.json(true);
} catch(err) {
   console.log(err)
   connection.query("ROLLBACK")
}
   }
   runquery()





   })
app.post("/addText",async function(request,response){
   checkTokenWithPromise(request).then(async user => {

   var name=request.body.text
   var id=request.body.id
  var data=await getMaxOrd(id)
 
   var type="text"
   var sql = "INSERT INTO items (name,type,active,display,ord) VALUES (?,?,?,?,?)";
   connection.query(sql, [name, type,1,id,data[0].currord], function(err, results) {
      if(!err){
         response.status(200).json(true)
      }
      
   })
}, err => {
   console.log("No such user. Error: " + err);
 })
   })
   

app.get("/getTVs",function(request,response){
   var sql = "SELECT *,(SELECT count(items.id) FROM items WHERE displays.id=items.display) as numOfSlides FROM displays ";
   connection.query(sql, function(err, results) {
      if (!err) {
         response.status(200).json(results)
      }
      
})
})
app.get("/numOfTVs",function(request,response){
   var sql = "SELECT id,name,location FROM displays";
   connection.query(sql, function(err, results) {
      if (!err) {
         response.status(200).json(results)
      }
      
})
})

app.post('/auth', function(request, response) {

//https://www.devglan.com/online-tools/bcrypt-hash-generator for generating correct hash
   var username = request.body.username;
   var password = request.body.password;


   var sql = "SELECT * FROM user WHERE username = ?";
   connection.query(sql, [username], function(err, results) {
      if (err) {
         response.send(false);
      } else if (results == "") {
         response.status(200).json(false);
      } else {
         bcrypt.compare(password, results[0].password, function(err, res) {
            if(res==true){
                 const JWTToken = jwt.sign({
             user: results[0].id
           },
           'asd', {
             expiresIn: 144000
           });
         response.status(200).json({
            token: JWTToken,
            user: username
         });
            }else{
               response.json(false)
            }
        });
       
      }
   });


});
app.get("/uredi", function(request, response) {
   checkTokenWithPromise(request).then(async user => {
   var sql = "SELECT id,name,active,type,ord,display,duration FROM items WHERE display=? ORDER BY ord asc"
   connection.query(sql,[request.query.id], function(err, results) {
     console.log(results)
      response.json(results)
   })

}, err => {
   console.log("No such user. Error: " + err);
 })

})
app.post("/deleteImg", function(request, response) {
   checkTokenWithPromise(request).then(async user => {
   var id = request.body.id
   var name = request.body.name
   var type=request.body.type
   var sql = "DELETE FROM items WHERE id=?"
   var sql2="SELECT count(name) as many FROM items" 
   connection.query("START TRANSACTION")
   connection.query(sql, [id], function(err, results) {
      if (!err) {
         console.log(type)
         if(type=="text" || type=="graph"){
            connection.query("COMMIT")
            response.json(true);
         }else{console.log("type")

         fs.stat(__dirname+'/upload/'+name, function (err, stats) {
           if(err){
              console.log(err)
              connection.query("COMMIT")
              response.json(true);
           }else{
         
         try{
            console.log("type")
            connection.query(sql2, function(err, results) {
               if(results[0].many<2 ){
                  console.log("haha")
                   fs.unlink(__dirname+'/upload/'+name,function(err){
               if(err) return console.log(err);
                  if(type=="html"){
                   
                  
                  fs.remove(__dirname+'/../src/assets/'+name,function(err){
                        if(err){
                           console.log(err)
                        }else{
                           name= name.split(".",1)
                           console.log(name)
                           var folder=name[0].split(/([^0-9]+)/)
                           folder=folder[1]+folder[2]
                           console.log(folder)
                        
                              /*            
                        var regex = new RegExp(folder)
                           fs.readdir(__dirname+"/../src/assets/")
                               .filter(f => regex.test(f))
                               .map(f => fs.remove(__dirname+"/../src/assets/" + f))
*/

                           fs.remove(__dirname+'/../src/assets/'+folder+"_datoteke",function(err){
                          console.log(err)
                           })
                        }
                  })
                  }
               console.log('file deleted successfully');
               connection.query("COMMIT")
               response.json(true);
                 });  
               }else{
                  connection.query("COMMIT")
                  response.json(true);
               }
           
            
         })
         }catch(error){
            console.log(error)
            connection.query("ROLLBACK")
         }
      }
      })
   }
      }
   })

}, err => {
   console.log("No such user. Error: " + err);
 })

})
app.post("/deleteTV", function(request, response) {
   checkTokenWithPromise(request).then(async user => {
   var id = request.body.id
  
   var sql = "DELETE FROM displays WHERE id=?"
 
   connection.query(sql, [id], function(err, results) {
      if (!err) {
         response.status(200).json(true)
         
      }else{
         response.json(false)
      }
   })

}, err => {
   console.log("No such user. Error: " + err);
 })

})
app.post("/addToOthers", async function(request, response) {
   checkTokenWithPromise(request).then(async user => {
   connection.query = util.promisify(connection.query)
   var promises=[]
   
   var data=request.body
   console.log(data)
   var name=data.item.name
   var active=data.item.active
   var type=data.item.type
   var display=data.item.display
   
 
   var duration=data.item.duration
   var graph=data.item.graph
   
  
   var sql="INSERT INTO  items (name,active,type,display,ord,duration) VALUES (?,?,?,?,?,?)";
   for(let i=0;i<data.id.length;i++){
      display=data.id[i]
      var ord=await getMaxOrd(display)
      promises.push(await connection.query(sql,[name,active,type,display,ord[0].currord,duration]));
   }
  Promise.all(promises).then(function(values){
     if(values){
        response.json(true)
     }else{
        response.json(false)
     }
  } )
}, err => {
   console.log("No such user. Error: " + err);
 })


})
app.post("/editTV", function(request, response) {
   checkTokenWithPromise(request).then(async user => {
   var id = request.body.id
   var name = request.body.name
   var location = request.body.location
   var sql = "UPDATE displays set name=?,location=? WHERE id=?"
   connection.query(sql, [name,location, id], function(err, results) {
      if (!err) {
         response.json(true);
      }
   })
}, err => {
   console.log("No such user. Error: " + err);
 })


})
app.post("/showhideImg", function(request, response) {
   checkTokenWithPromise(request).then(async user => {
   var id = request.body.id
   var active = request.body.active
   var sql = "UPDATE items set active=? WHERE id=?"
   connection.query(sql, [active, id], function(err, results) {
      if (!err) {
         response.json(true);
      }
   })
}, err => {
   console.log("No such user. Error: " + err);
 })

})
app.post("/showhideVid", function(request, response) {
   checkTokenWithPromise(request).then(async user => {
   var id = request.body.id
   var active = request.body.active
   var sql = "UPDATE items set active=? WHERE id=?"
   connection.query(sql, [active, id], function(err, results) {
      if (!err) {
         response.json(true);
      }
   })

}, err => {
   console.log("No such user. Error: " + err);
 })

})
app.post("/deleteVid", function(request, response) {
   checkTokenWithPromise(request).then(async user => {
   var id = request.body.id
   var name=request.body.name
   var sql = "DELETE FROM items WHERE id=?"
   connection.query("START TRANSACTION")
   connection.query(sql, [id], function(err, results) {
      if (!err) {

         fs.stat(__dirname+'/upload/'+name, function (err, stats) {
            if(err){
               console.log(err)
               connection.query("COMMIT")
               response.json(true);
            }else{
          
          try{
             fs.unlink(__dirname+'/upload/'+name,function(err,result){
                if(err) return console.log(err);
                console.log(result)
                console.log('file deleted successfully');
                connection.query("COMMIT")
                response.json(true);
           });  
          }catch(error){
             console.log(error)
             connection.query("ROLLBACK")
          }
       }
       })
      }
   })
}, err => {
   console.log("No such user. Error: " + err);
 })


})
app.post("/updateImgRed", function(request, response) {
   checkTokenWithPromise(request).then(async user => {
   connection.query = util.promisify(connection.query)
   var id = request.body.id
   var red = request.body.red
   var display=request.body.display
  
  if(red=="+"){
     var updatedORD="SELECT ord,id,display  FROM items WHERE id=?"
    var updateOthers="UPDATE items set ord=ord-1 WHERE ord=?+1 and display=? and id!=?"
   var updateSelected = "UPDATE items set ord=ord + 1 WHERE id=?"
   
  }else{
   var updatedORD="SELECT ord,id,display  FROM items WHERE id=?"
   var updateOthers="UPDATE items set ord=ord+1 WHERE ord=?-1 and display=? and id!=?"
  var updateSelected = "UPDATE items set ord=ord - 1 WHERE id=?"
  }
  async function runquery(){
      try {
   var result1 = await connection.query(updatedORD,[id])
  var result2=await connection.query(updateOthers,[result1[0].ord,display,id])
  var result3=await connection.query(updateSelected,[id])

  connection.query("COMMIT")
  response.json(true);
} catch(err) {
   console.log(err)
   connection.query("ROLLBACK")
}
   }
   runquery()
  
  
  /* connection.query(sql, [ id], function(err, results) {
      if (!err) {
         console.log(results)
         response.json(true);
      }
   })
   */

}, err => {
   console.log("No such user. Error: " + err);
 })

})
app.post("/updateItemDur", function(request, response) {
   checkTokenWithPromise(request).then(async user => {
   var id = request.body.id
   var red = request.body.red
  if(red=="+"){
   var sql = "UPDATE items set duration=duration+1000 WHERE id=?"
   
  }else{
   var sql = "UPDATE items set duration=duration-1000 WHERE id=?"
  }
 
  
   connection.query(sql, [ id], function(err, results) {
      if (!err) {
         console.log(results)
         response.json(true);
      }
   })
}, err => {
   console.log("No such user. Error: " + err);
 })


})





app.listen(3000, () => console.log('Example app listening on port 3000!'))