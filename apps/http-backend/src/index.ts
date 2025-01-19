import express from "express";
import router from "./routes/user";

const app = express();

app.use("/user", router);



app.listen(3001, () => console.log("Server is running on port 3001"));