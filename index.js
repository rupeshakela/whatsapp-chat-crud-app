const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const chat=require("./models/chat.js");
const methodOverride=require("method-override");


app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

main().then(()=>{
    console.log("connection is successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}


////this just for understanding 

// let chat1=new chat({
//     from:"rupesh",
//     to:"sima",
//     msg:"mummy ko call do",
//     created_at:new Date()
// });

// chat1.save().then(res=>{
//     // console.log(res);
// })
// .catch(err=>{
//     console.log(err);
// });


//Index Route

app.get("/chats",async(req,res)=>{
    let chats=await chat.find();
    res.render("index.ejs",{chats});
});

//New Route
app.get("/chats/new",(req,res)=>{//show form
    res.render("new.ejs");
});

//Create Route
app.post("/chats",(req,res)=>{//form submit
    let {from ,to,msg}=req.body;
    let newChat=new chat({
        from:from,
        to:to,
        msg:msg,
        created_at:new Date()
    });
    //save data
    newChat.save().then(res=>{
        console.log("chat has successfully saved")
    })
    .catch(err=>{
        console.log(err)
    });

    res.redirect("/chats");
});


//EDIT Route
app.get("/chats/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let chatData= await chat.findById(id);
    res.render("edit.ejs",{chatData});
});

//UPDATE Route
app.put("/chats/:id",async(req,res)=>{
    let {id}=req.params;
    let{msg:newMsg}=req.body;
    let updatedChat= await chat.findByIdAndUpdate(id,{msg:newMsg}
        ,{runValidators:true, returnDocument: "after" }
    );
    res.redirect("/chats");
});

//DELETE Route
app.delete("/chats/:id",async (req,res)=>{
    let{id}=req.params;
    let deletedChat=await chat.findByIdAndDelete(id);
    // console.log(deletedChat);
    res.redirect("/chats");
});



app.get("/",(req,res)=>{
    res.send("this is having the local path");
});

app.listen(5000,()=>{
    console.log("server is running at port 5000");
});