require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

main().catch(err => {
    console.log(err);
    process.exit(1);
});

async function main(){
    await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@noteweb.zbks9.mongodb.net/noteweb?retryWrites=true&w=majority`)
    console.log('MongooseDB connected');
}

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
const PORT = 8080;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));