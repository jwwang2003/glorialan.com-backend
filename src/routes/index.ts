import express from "express";
import auth from "./authentication";
import experimentImageUpload from "./experiments/imageUpload";

const app = express();

app.use("/auth", auth);
app.use("/experimental", experimentImageUpload);

export default app;