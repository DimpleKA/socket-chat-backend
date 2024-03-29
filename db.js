const mongoose = require('mongoose');

const dbConnect= async()=>{
    try{
        uri="mongodb+srv://Dimpleusername:Dimple999@cluster0.l6frpvy.mongodb.net/socketio?retryWrites=true&w=majority&appName=Cluster0";
      await mongoose.connect(uri,)
        console.log("connected to mongodb");
    }catch(error){
        console.log("could not connect some error happenend"+error);
    }
}

module.exports= dbConnect;