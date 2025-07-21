const express = require("express");
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser");
const s3UploadRoutes = require("./Routers/s3upload");
require("dotenv").config()
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
const protectedRoute = require("./Routers/loginRouter")
const authRouter = require("./Routers/router");
const vodRouter = require("./Routers/VODdatabasRouter");
const CommentRouter = require("./Routers/notesRouter");
app.use("/api", authRouter);
app.use("/api", protectedRoute)
app.use("/api", vodRouter)
app.use("/api", s3UploadRoutes);
app.use("/api", CommentRouter);
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT =  process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
