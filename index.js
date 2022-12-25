const express = require('express')
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express()

app.use(express.json())
app.use(cors())

const uri = process.env.SECRET_URI;

const Client =new MongoClient(uri);

const run =async()=>{
    try {
        const UserDataCollection = Client.db("UserDataInput").collection("userData")
        app.post("/userData",async(req, res)=>{
            const result = await UserDataCollection.insertOne(req.body);
            res.send(result);
        })
        app.get("/userData",async(req,res)=>{
            const result = await UserDataCollection.find({}).toArray();
            res.send(result);
        });
        app.get("/userData/:id",async(req,res)=>{
            const result = await UserDataCollection.findOne({_id: ObjectId(req.params.id)});
            res.send(result);
        });
        app.delete("/userData/:id",async(req,res)=>{
            const result = await UserDataCollection.deleteOne({_id : ObjectId(req.params.id)})
            res.send(result);
        })
        app.patch("/userData/:id",async(req,res)=>{
            const query = {_id : ObjectId(req.params.id)};
            const result = await UserDataCollection.updateOne(query,{$set : {
                name : req.body.name,
                profession: req.body.profession
            }});
            res.send(result);
        })
    } catch (error) {
        console.log(error);
    }
}
run().catch(error=>console.log(error))
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))