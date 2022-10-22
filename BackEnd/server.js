const express = require( 'express' );
const cors = require( 'cors' );
const PORT = 1800;
const app = new express();
const router = require('.//Routes/routes')
app.use( express.json() );

let corsOptions = {
    origin: '*' // Compliant
};
   
app.use(cors(corsOptions));
  
app.use(router)

app.listen( PORT, () => console.log(`Listening at ${ PORT } successfully`) );