const express = require("express");
const app = express();
const cors = require("cors")
app.use(cors())
app.use(express.json());
const protectedRoute = require("./loginRouter")
const authRouter = require("./router");
app.use("/api", authRouter);
app.use("/api", protectedRoute)

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
