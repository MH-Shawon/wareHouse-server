const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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

        app.get('/phones/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const phone = await phoneCollection.findOne(query);
            res.send(phone)
        });

        //  updated Quantity 
        app.put("/phones/:id", async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
              $set: {
                quantity: updatedQuantity.quantity,
              },
            };
            const result = await itemsCollection.updateOne(
              filter,
              updatedDoc,
              options
            );
            res.send(result);
          });

        // post method 

        app.post("/phones", async (req, res) => {
            const newItem = req.body;
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
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