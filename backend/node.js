const express = require('express')
var bodyParser = require("body-parser")
var cors = require('cors')
var mysql = require('mysql')
const app = express()
var conf = require('./config')
conf = new conf()
const fs = require('fs')
var util = require('util')


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
 



   var slike = [];
   var data;
   var sql = 'SELECT id,name,active,type,ord,duration FROM items WHERE active=1 and display=? ORDER BY type asc';
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
            if(data[i].type=="image" || data[i].type=="pdf"){

               promises.push(getImage(data[i]));
            }
           
            
         }
        
         // return promise that is resolved when all images are done loading
         return Promise.all(promises);
      }

      getAllImages().then(function(imageArray) {
         
         for (var i = 0; i < imageArray.length; i++) {
       
            if(data[i].type=="image" || data[i].type=="pdf"){
            
                slike.push({
               "slika": imageArray[i].toString("base64"),
               "name":data[i].name,
               "type":data[i].type,
               "ord":data[i].ord,
               "dur":data[i].duration
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
            
         }
         
       

         res.json(slike)
      }, function(err) {
         // an error occurred
      });




   });


});

app.post("/image",async function(request, response) {
  
   if (!request.body.item.value) {
      response.json(false)
      return false;
   } 
   var filename = request.body.item.filename;
   var image = request.body.item.value;
   var filetype = request.body.item.filetype;
   var display=request.body.tvid
   var customtype;
   var data=await getMaxOrd(display)
  console.log(filetype)
   if(filetype.includes("video")){
customtype="video"
   }else if(filetype.includes("image")){
      customtype="image"
   }else if(filetype.includes("pdf")){
      customtype="pdf"
   }
      try {
         fs.writeFile(__dirname+"/upload/" + filename, image, "base64", function(err) {
            if (err) {
               return console.log(err);
            }
            var sql = "INSERT INTO items (name,active,type,display,ord) VALUES (?,?,?,?,?)";
            connection.query(sql, [filename, 1,customtype,display,data[0].currord], function(err, results) {
               
               if(!err){
                  console.log("The file was saved!");
                 
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
  
   
     
  

});
 function getMaxOrd(display){
   
   connection.query = util.promisify(connection.query)
   return new Promise(async function(resolve, reject) {
   var sql="SELECT max(ord)+1 as currord FROM items WHERE display=?"
   var result=await connection.query(sql,[display])
  return resolve(result)
   
   })

}

app.post("/addTVs",function(request,response){
   if(!request.body.name){
      response.status(400).json(false)
      return false;
   }
var name=request.body.name
var location=request.body.location
var sql = "INSERT INTO displays (name,location) VALUES (?,?)";
connection.query(sql, [name, location], function(err, results) {
   if(!err){
      response.status(200).json(true)
   }
})
})
app.post("/addText",async function(request,response){


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
   })

app.get("/getTVs",function(request,response){
   var sql = "SELECT *,(SELECT count(items.id) FROM items WHERE displays.id=items.display) as numOfSlides FROM displays ";
   connection.query(sql, function(err, results) {
      if (!err) {
         response.status(200).json(results)
      }
      
})
})

app.post('/auth', function(request, response) {


   var username = request.body.username;
   var password = request.body.password;


   var sql = "SELECT * FROM user WHERE username = ? AND password = ?";
   connection.query(sql, [username, password], function(err, results) {
      if (err) {
         res.send(false);
      } else if (results == "") {
         response.status(200).json(false);
      } else {
         /*
         const JWTToken = jwt.sign({
             user: results[0].id
           },
           'asd', {
             expiresIn: 144000
           });*/
         response.status(200).json({
            token: "token",
            user: username
         });
      }
   });


});
app.get("/uredi", function(request, response) {
 
   var sql = "SELECT id,name,active,type,ord,display,duration FROM items WHERE display=? ORDER BY ord asc"
   connection.query(sql,[request.query.id], function(err, results) {
     
      response.json(results)
   })



})
app.post("/deleteImg", function(request, response) {

   var id = request.body.id
   var name = request.body.name
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
            fs.unlink(__dirname+'/upload/'+name,function(err){
               if(err) return console.log(err);
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



})
app.post("/deleteTV", function(request, response) {

   var id = request.body.id
  
   var sql = "DELETE FROM displays WHERE id=?"
 
   connection.query(sql, [id], function(err, results) {
      if (!err) {
         response.status(200).json(true)
         
      }else{
         response.json(false)
      }
   })



})
app.post("/showhideImg", function(request, response) {

   var id = request.body.id
   var active = request.body.active
   var sql = "UPDATE items set active=? WHERE id=?"
   connection.query(sql, [active, id], function(err, results) {
      if (!err) {
         response.json(true);
      }
   })



})
app.post("/showhideVid", function(request, response) {

   var id = request.body.id
   var active = request.body.active
   var sql = "UPDATE items set active=? WHERE id=?"
   connection.query(sql, [active, id], function(err, results) {
      if (!err) {
         response.json(true);
      }
   })



})
app.post("/deleteVid", function(request, response) {

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



})
app.post("/updateImgRed", function(request, response) {
   connection.query = util.promisify(connection.query)
   var id = request.body.id
   var red = request.body.red
   var display=request.body.display
   console.log(display)
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
  console.log(result1)
  console.log(result2)
  console.log(result3)
  console.log('updated');
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



})
app.post("/updateItemDur", function(request, response) {

   var id = request.body.id
   var red = request.body.red
  if(red=="+"){
   var sql = "UPDATE items set duration=duration+1000 WHERE id=?"
   
  }else{
   var sql = "UPDATE items set duration=duration-1000 WHERE id=?"
  }
   console.log(red)
  
   connection.query(sql, [ id], function(err, results) {
      if (!err) {
         console.log(results)
         response.json(true);
      }
   })



})





app.listen(3000, () => console.log('Example app listening on port 3000!'))