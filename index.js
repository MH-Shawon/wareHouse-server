const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');


app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b3p90m3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try{
        const phoneCollection = client.db('phoneWarehouse').collection('phoneItem');
        
        app.get('/phones', async(req,res)=>{
            const query = {};
            const cursor = phoneCollection.find(query);
            const phones = await cursor.toArray();
            res.send(phones);
            console.log(phones)
        });
    }
    finally{}

}

run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('WareHOuse server is running');
})

app.listen(port, ()=>{
    console.log('Listening to port', port);
})