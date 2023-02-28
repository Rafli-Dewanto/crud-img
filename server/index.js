import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import productRoute from './routes/product.route.js';

const app = express();
app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));
app.use(productRoute);
app.listen(process.env.PORT || 3000, () => console.log(`Server running on http://localhost:${process.env.PORT}`))