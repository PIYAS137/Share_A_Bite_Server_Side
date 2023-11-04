
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5020;



// middlewares-------------------------------------------------------------------------------------------->>>>>
app.use(cors())
app.use(express.json())
// middlewares-------------------------------------------------------------------------------------------->>>>>


// ----------------------------------------------------MongoDB-------------------------------------------->>>>>

// ----------------------------------------------------MongoDB-------------------------------------------->>>>>







app.get('/',(req,res)=>{
    res.send("Server is coming soon...");
})



app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
