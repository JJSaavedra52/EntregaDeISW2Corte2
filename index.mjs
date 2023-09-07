import Express from "express";
import bodyParser from "body-parser";
import { startConnection } from "./src/mongo/index.mjs";
import cosa from "./src/handlers/filters/index.mjs"

const app = Express();
app.use(bodyParser.json())

const PORT = 3000;

app.use("/filter", cosa);

app.get("/", (req, res) => {
    res.send("Hola")
})

const startServer = async () => {
    await startConnection();
    app.listen(PORT, () => {
        console.log('http://localhost:3000');
    })
}

startServer();