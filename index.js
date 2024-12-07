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
    const wishList=client.db('wish').collection('favourite')



    app.get('/addMovies', async (req, res) => {
      const { title } = req.query;
    
        const query = title
          ? { title: { $regex: title, $options: "i" } } 
          : {};
        const movies = await Added.find(query).toArray(); 
        console.log("Query:", query);
   res.json(movies);
      
    });
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
    // await Added.createIndex({ title: "text", genre: "text" });
   
    
    

    
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
    
        const result = await wishList.updateOne(query, update, options);
        res.send(result);
    
    });
    app.get('/favourites/:email', async (req, res) => {
      const email = req.params.email;
    
        const query = { email: email }; 
        const userFavorites = await wishList.findOne(query);    
        res.send(userFavorites.movies);
    
    });
    
    app.delete('/favourites/:email', async(req,res)=>{
      const email=req.params.email;
      console.log('email deleted successfully')
      const query={email: email}
      const result =await wishList.deleteOne(query)
      res.send(result)
    })
    app.get('/update/:id', async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const movie=await Added.findOne(query)
      console.log('update',query);
      res.send(movie)
 })

 app.put('/update/:id', async(req, res)=>{

     const id=req.params.id;
     const movie=req.body;
     console.log('update',movie);
     const filter={_id : new ObjectId(id)}
     const option={upsert:true}
     const updateUser={
         $set:{
          poster:movie.poster,
             title: movie.title,
             poster:movie.poster,
            rating:movie.rating,
           overview:movie.overview,



         }
     }
     const result= await Added.updateOne(filter,updateUser,option)
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
