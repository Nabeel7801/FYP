const mongoose = require("mongoose")
const dotenv = require("dotenv");
const express = require("express")
const cors = require("cors")
const connection = mongoose.connection

dotenv.config();

mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

const app = express();
app.use(cors())

app.use(express.json())
app.use(require("./routes/users"))
app.use(require("./routes/roles"))
app.use(require("./routes/loginDetails"))

const port = process.env.PORT || 5000

connection.once("open", () => {
    console.log("DB Connection Successfull");
})

const server = require("http").createServer(app);
server.listen(port, () => console.log(`Server now running on port ${port}!`));