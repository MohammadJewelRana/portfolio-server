const express = require('express')
const app = express()

//mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//dotenv
require('dotenv').config()

 

const cors = require('cors');
const port = process.env.PORT || 5000;



//middleware
app.use(cors())
app.use(express.json())
 




//---------------------DB Start--------------------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.843endu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();

        //....................code start...................

        //all collection
        // const classesCollection = client.db("CosMake").collection('classes');
         const  projectCollection = client.db("portfolio").collection('projects');
        

        app.post('/projects',async(req,res)=>{
            const newProject=req.body;
            // console.log(newClass);

            const result = await projectCollection.insertOne(newProject);
            res.send(result);
        })



        app.get('/projects', async (req, res) => {
            const result = await projectCollection.find().toArray();
            res.send(result);
        })



        app.put('/projects/:id',async(req,res)=>{
            const id=req.params.id;//get id 
            const filter={_id:new ObjectId(id)}//get specific data 
            const options={upsert:true}//if data exist update otherwise create 
            const updatedProject=req.body;//get data from client side 
    
            // console.log(id,updatedProject);
             
            // set data 
            const updateData={ 
              $set:{ 
                
                projectName: updatedProject.projectName,
                serverLink: updatedProject.serverLink,
                serverLinkGithub:updatedProject.serverLinkGithub,
                clientLink: updatedProject.clientLink,
                liveLink: updatedProject.liveLink,
                description: updatedProject.description

              } 
            } 
    
    
            const result=await projectCollection.updateOne(filter,updateData,options) 
            res.send(result); 
          })
    
    
      // delete project 
      app.delete('/projects/:id',async(req,res)=>{ 
        const getId=req.params.id; 
        // console.log(getId); 
        const query={_id :new ObjectId(getId)} 
        const result=await projectCollection.deleteOne(query); 
        res.send(result) 
   
      }) 

        // app.post('/contact',async(req,res)=>{
        //     const newProject=req.body;
        //     // console.log(newClass);
        //     const result = await projectCollection.insertOne(newProject);
        //     res.send(result);
        // })

        // app.get('/contact', async (req, res) => {
        //     const result = await projectCollection.find().toArray();
        //     res.send(result);
        // })





 
        //         //get all user
        //         app.get('/users', async (req, res) => {
        //             const result = await usersCollection.find().toArray();
        //             res.send(result);
        //         })

        // // //get specific user cart product
        // app.get('/users/:email', async (req, res) => {
        //     const email = req.params.email;
        //     // console.log(email);
        
        //         if (!email) {
        //             res.send([]);
        //         }
        //         //find multiple document
        //         const query = { email: email };
        //         const result = await usersCollection.find(query).toArray();
        //         res.send(result);
            
        // })

 
 
  

 


 



 
 
 
        
 
 

 

        //...........end code ................




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

//-------------------------------------------------------------




app.get('/', (req, res) => {
    res.send('Portfolio is running')
})

app.listen(port, () => {
    console.log(`Running at port is ${port}`);
})
