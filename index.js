//jshint esversion:8


const express = require('express');
const mongoose = require('mongoose')

const port = process.env.PORT||8000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static('static'))
const url = 'mongodb://127.0.0.1:27017/BOOK_STORE';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log("Database connected...");
})

//Database
const bookSchema = new mongoose.Schema({
    Name :{type:String,required: true},
    ISBN : {type : String, required : true},
    Author: {type : String, required : true},
    Price: {type : String, required : true},
    Counter_of_Origin: {type : String},
    Number_Of_Pages: {type : Number},
    Year: {type : Number,required : true},
    Stock_Available: {type : Number,required : true},
    Digital_Format_Available: {type : Boolean}
})

const book = mongoose.model("book",bookSchema);
//add books

//fetch by isbn
app.post("/find_by_isbn",async(req,res)=>{
    const bisbn = await book.find({ISBN:req.body.value});
    console.log(bisbn);
    res.render('book_by_isbn', {book: bisbn[0]});

})

//fetch all books
app.get("/find_all", async(req,res)=>{
    const bisbn = await book.find();
    console.log(bisbn);
    res.render('all_books', {books: bisbn});

})
//add all books
app.post("/add_books",async(req,res)=>{
    //console.log(req.body);
    await book.insertMany({Name:req.body.Name, ISBN : req.body.ISBN, Author : req.body.AUTHOR, Price : req.body.PRICE , Counter_of_Origin:req.body.Counter_of_Origin,
    Number_Of_Pages:Number(req.body.Number_Of_Pages), Year : Number(req.body.Year), Stock_Available : Number(req.body.Stock_Available)});
    console.log(book.find())
    res.send("<h1>Book added successfully</h1>")
})
//delete a book by name
app.post("/del_books",async(req,res)=>{
    const bisbn = await book.find({ISBN:req.body.value});
    const deleted = await book.deleteOne({ISBN:req.body.value});
    console.log(bisbn);
    // res.render('delete_book',{book : deleted[0]});
    res.render('delete_book',{book : bisbn[0]});

})
//update a book
app.post("/update_book",async(req,res)=>{
    await book.updateOne({Name:req.body.Name},{Name:req.body.Name, ISBN : req.body.ISBN, Author : req.body.AUTHOR, Price : req.body.PRICE , Counter_of_Origin:req.body.Counter_of_Origin,
    Number_Of_Pages:Number(req.body.Number_Of_Pages), Year : Number(req.body.Year), Stock_Available : Number(req.body.Stock_Available)})
    const bis= await book.find({ISBN:req.body.isbn});
   res.render('update',{book:bisbn[0]});
})
//update a book by isbn
app.post("/update_book_byisbn",async(req,res)=>{
    await book.updateOne({ISBN:req.body.ISBN},{Name:req.body.Name, ISBN : req.body.ISBN, Author : req.body.AUTHOR, Price : req.body.PRICE , Counter_of_Origin:req.body.Counter_of_Origin,
    Number_Of_Pages:Number(req.body.Number_Of_Pages), Year : Number(req.body.Year), Stock_Available : Number(req.body.Stock_Available)})
    console.log(book.find({ISBN:req.body.isbn}));
    res.send("<h1> Book updated successfully </h1>")
})
app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})
app.listen(port,function(){
    console.log("started");
});