const express=require('express')
const app=express();
const port=process.env.PORT || 4000
const cors=require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } =  require('mongodb');

//middleware
app.use(cors());
app.use(express.json());
// console.log(process.env.DB_USER)
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




     
    app.get('/addMovies',async(req,res)=>{
      const cursor=Added.find();
      const result= await cursor.toArray();
      res.send(result);

    })
    app.get('/featured',async(req,res)=>{
      const cursor=Added.find();
      const result = await Added.find().sort({ rating: -1 }).limit(6).toArray();
      // Sort descending (highest values first)
      // Limit to top 3 results
    
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

    app.post('/favourites/:email', async (req, res) => {
      const email = req.params.email;
      const movie = req.body; 
    console.log('favoirite',email, movie)

        const query = { email: email };
        const update = {
          $addToSet: { movies: movie },
        };
        const options = { upsert: true };
    
        const result = await Added.updateOne(query, update, options);
        res.send(result);
    
    });
    app.get('/favourites/:email', async (req, res) => {
      const email = req.params.email;
    
        const query = { email: email }; 
        const userFavorites = await Added.findOne(query);    
        res.send(userFavorites.movies);
    
    });
    
    
   // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.listen(port, ()=>{
  console.log(`server running on por ${port}`)
})
