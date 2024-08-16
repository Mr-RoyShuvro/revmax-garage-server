const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

/* Using middleware */
app.use(cors());
app.use(express.json());

/* Get */
app.get('/', (req, res)=>{
    res.send('Server is running');
})

/* Listen */
app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})