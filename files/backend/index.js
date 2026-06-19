import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connection from './config/db.js';
import agentRoutes from './routes/userRoutes.js'
import propertyRoutes from './routes/propertyroute.js'
import productRoutes from './routes/productrouter.js'
import serviceRoutes from './routes/serviceRouter.js'

dotenv.config() 
const PORT = process.env.PORT;

const app = express();
connection()

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/api/agent', agentRoutes)
app.use('/api/property', propertyRoutes)
app.use('/api/product', productRoutes)
app.use('/api/service', serviceRoutes)



app.listen(PORT, () => {
    console.log(`app listening on port: ${PORT}`)
})
