import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`port is running ${port}`);
});