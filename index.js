const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();
const port = 5000; 


//Middlewere 
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = "mongodb+srv://task-test:hKfv1VsXj9rESXU3@cluster0.qhwuq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('job-task');
        const userCollection = database.collection('users')
        const pdfsCollection = database.collection('pdfs')

        app.get('/users', async(req, res)=>{
            const cursor = userCollection.find();
            const user = await cursor.toArray()
            res.send(user)
        })

        app.get('/pdfs', async(req, res)=>{
            const cursor = pdfsCollection.find();
            const pdfs = await cursor.toArray()
            res.send(pdfs)
        })
        
        app.get('/pdfs/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const pdf = await pdfsCollection.findOne(query);
            res.json(pdf);
        })

        app.post('/pdfs', async(req, res)=>{
            // console.log('files', req.files)
            const pdfs = req.files.pdf;
            const pdfData = pdfs.data;
            const encodedPdf = pdfData.toString('base64');
            const pdfBuffer = Buffer.from(encodedPdf, 'base64');
            const pdf = {
                pdf: pdfBuffer
            }
            const result = await pdfsCollection.insertOne(pdf)
            res.json(result)
        })
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res)=>{
    res.send('Server Running');
})

app.listen(port, ()=>{
    console.log('Server running on port', port)
})