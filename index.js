const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
var cors = require('cors');

const app = express();

// Neccessary Middlewares
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(
  cors({
    origin: ["http://localhost:2000"],
    credentials: true,
  }),
);

const mongoString = "mongodb://localhost:27017/learn_node"

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    rollno: {
        required: true,
        type: Number
    }
})

const Student = mongoose.model('Student', dataSchema)

const router = express.Router()

router.get("/", (req, res) => {
    return res.status(200).json({
        message: "welcome!"
    });
})

app.use("/", router);

//Post Method
router.post('/addStudent', async (req, res) => {
    try {
        console.log(req.body);
        const new_student = await Student.create({
            name: req.body.name,
            rollno: req.body.rollno
        })

        res.status(200).json(new_student)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get Method
router.get('/getAll', async (req, res) => {
    try {
        const data = await Student.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/updateName',async (req,res) => {
    try{
       let oldStudent = await Student.findOneAndUpdate({rollno:req.body.rollno},{name:req.body.name}); 
       if(!oldStudent){
          throw new Error("Student not found!");
       }

       const updatedStudent = await Student.findOne({
           rollno:req.body.rollno
       });

       res.status(200).json({
          message : "updated!",
          data : updatedStudent
       })
    }
    catch(error){
       res.status(500).json({
        message:error.message
       })  
    }
})

router.post('/deleteStudent',async (req,res) => {
    try{
       let oldStudent = await Student.deleteOne({rollno:req.body.rollno});
       if(oldStudent.deletedCount == 0){
         throw new Error("Student not found!");
       }
       
       res.status(200).json({message:"deleted"});
    }
    catch(error){
       res.status(500).json({message:error.message}); 
    }
})

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})