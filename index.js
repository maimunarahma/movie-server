const express=require('express')
const app=express();
const port=process.env.PORT || 4000
const cors=require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER)
app.get('/',(req,res)=>{
    res.send('movie server  ');

})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n0bjr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    const database=client.db('MovieDB');
    const Added=database.collection('addMovies');

    // const database = client.db('coffeeDB');
    // const coffeeCollection = database.collection('coffee');

    // const userCollection = client.db('coffeeDB').collection('users');



     
    app.get('/addMovies',async(req,res)=>{
      const cursor=Added.find();
      const result= await cursor.toArray();
      res.send(result);

    })


    app.post('/addMovies',async(req,res)=>{
      const movie=req.body;
      console.log('new movie',movie);
      
        const result=await Added.insertOne(movie);
        res.send(result)
     

      

    })


    
    app.get('/details/:id', async(req,res)=>{
      const id=req.params.id;
      const query= {_id: new ObjectId(id)}
      const movie=await Added.findOne(query)
      res.send(movie)
    
    })
    app.delete('/details/:id', async(req,res)=>{
      const id=req.params.id;
      console.log('id deleted successfully')
      const query={_id: new ObjectId(id)}
      const result =await Added.deleteOne(query)
      res.send(result)
    })

   // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.listen(port, ()=>{
  console.log(`server running on por ${port}`)
})
