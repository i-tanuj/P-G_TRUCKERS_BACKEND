import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import loginRoute from './routes/login.js'
import shipmentRoutes from './routes/shipmentRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import driverRoutes from './routes/driverRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import helperRoutes from './routes/helperRoutes.js'
import resetpasswordRoutes from './routes/resetpasswordRoutes.js'
import vehicleRoutes from './routes/vehicleRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import changepasswordRoutes from './routes/changespasswordRoutes.js'
import dispatcherRoutes from './routes/dispatcherRouters.js'


const app = express()
const PORT = process.env.PORT || 5000

app.use(cors());
app.use('/uploads',express.static("uploads"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.json({ message: "welcome to dwellfox" });
});

app.use('/login',loginRoute);
app.use('/api',resetpasswordRoutes);
app.use('/api',changepasswordRoutes);
app.use('/api',dispatcherRoutes);
app.use('/api',driverRoutes);
app.use('/api',helperRoutes);
app.use('/api',vehicleRoutes);
app.use('/api',paymentRoutes);
app.use('/api',notificationRoutes);
app.use('/api', shipmentRoutes)
app.use('/api', customerRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });