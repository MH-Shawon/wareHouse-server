const express = require('express');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b3p90m3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        const phoneCollection = client.db('phoneWarehouse').collection('phoneItem');

        const orderCollection = client.db('phoneWarehouse').collection('order');

        app.get('/phones', async (req, res) => {
            const query = {};
            const cursor = phoneCollection.find(query);
            const phones = await cursor.toArray();
            res.send(phones);

        });

        app.get('/phones/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const phone = await phoneCollection.findOne(query);
            res.send(phone)
        });




        // post method 

        app.post("/phones", async (req, res) => {
            const newItem = req.body;
            const result = await phoneCollection.insertOne(newItem);
            res.send(result);
        });


        app.delete('/phones/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await phoneCollection.deleteOne(query);
            res.send(result);
        });


        // jwt impliment 

        app.post('/accesstoken', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })



        //   order collection  api
        app.get('/orders', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;

            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = orderCollection.find(query);
                const orders = await cursor.toArray();
                res.send(orders);
            }
            else{
                res.status(403).send({message: 'forbidden access'})
            }
        });
        app.post("/order", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        //   order delete

        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally { }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('WareHOuse server is running');
})

app.listen(port, () => {
    console.log('Listening to port', port);
})