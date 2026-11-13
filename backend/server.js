// start server
require("dotenv").config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

let port = 3000;
app.listen(port, () => {
    console.log(`server is running on port ${port} `);
})