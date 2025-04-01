require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const FeedbackRoutes = require("./Routes/Feedback");
const PrivateFeedback = require("./Routes/PrivateFeedback");
const ClassRoutes = require("./Routes/Class");
const userRoutes = require("./Routes/users");
const authRoutes = require("./Routes/authenticator");
const ServicesRoutes = require("./Routes/service");
const PlanRoutes = require("./Routes/plan");
const purchaseHistoryRouter = require("./Routes/purchaseHistory");
const RequestPlanRoutes = require("./Routes/planRequest");
const MetadataRoutes = require("./Routes/metaData");
const helmet = require('helmet');

// Conexión a la base de datos
connection();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet())

// Body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Routes
app.use("/register", userRoutes);
app.use("/auth", authRoutes);
app.use("/comentarios", FeedbackRoutes);
app.use("/privatefeedback", PrivateFeedback);
app.use("/class", ClassRoutes);
app.use("/service", ServicesRoutes);
app.use("/plan", PlanRoutes);
app.use("/purchase-history", purchaseHistoryRouter);
app.use("/planRequest", RequestPlanRoutes);
app.use("/users", userRoutes);
app.use("/metadata", MetadataRoutes);

// Configuración del puerto
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
