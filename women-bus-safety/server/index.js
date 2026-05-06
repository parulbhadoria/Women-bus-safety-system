const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const sosRoutes = require("./routes/sos");
const notifyRoutes = require("./routes/notify");
const busRoutes = require("./routes/buses");
const journeyRoutes = require("./routes/journey");
const adminRoutes = require("./routes/admin");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
require("./config/firebase");

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (_req, res) => res.json({ message: "Women Bus Safety API running" }));
app.use("/api/auth", authRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/notify", notifyRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
