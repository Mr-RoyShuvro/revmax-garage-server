const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

/* Using middleware */
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Using Personal Middleware 
const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).send({ message: "Not authorized" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {

        // if error
        if (err) {
            return res.status(401).send({ message: 'Unauthorized...' })
        }

        // if token is valid, it would be decoded
        req.user = decoded;
        next();
    });
}


/* mongodb connection start */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d0o34gr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        /* Collection Data Mongodb-revmax-Garage */
        const serviceCollection = client.db("revmaxGarage").collection("services");
        const bookingCollection = client.db("revmaxGarage").collection("bookings");

        /* Auth related API */
        app.post("/jwt", async (req, res) => {
            const user = req.body;
            console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                })
                .send({ success: true });
        });


        /* Services related API */
        /* Get Services data */
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        /* Get specific service only one */
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            /* using options */
            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, service_id: 1, img: 1 },
            };

            const result = await serviceCollection.findOne(query, options);
            res.send(result);
        });

        /* For Bookings */
        app.get("/bookings", verifyToken, async (req, res) => {
            // console.log('Here is the token', req.cookies.token);

            if(req.query.email !== req.user.email){
                return res.status(403).send({message: 'User is forbidden'});
            }
            console.log('User in the valid token', req.user);
            console.log(req.query.email);
            let query = {};
            /* filter by email */
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        });

        app.post("/bookings", async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });


        app.patch("/bookings/:id", async (req, res) => {
            const updatedBooking = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: updatedBooking.status
                },
            };
            const result = await bookingCollection.updateOne(query, updateDoc);
            res.send(result);
        });

        app.delete("/bookings/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

/* mongodb connection finish */


/* Get */
app.get('/', (req, res) => {
    res.send('Server is running');
})
/* Listen */
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})