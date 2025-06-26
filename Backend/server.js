import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import { RateCalculator } from './routes/rateCalculator.js';
import { ScheduleaShip } from './routes/scheduleaShip.js';
import { BecomeCustomer } from './routes/becomeCustomer.js';
import { BecomeRider } from './routes/becomeRider.js';
import { EmployeeRoute } from './routes/employee.js';
import { Route } from './models/route.js'
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { InsuranceRoute } from './routes/insurance.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    credentials: true,
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT;
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err.message);
  console.error(err);
});


// Session configuration
app.use(session({
  secret: 'l1f21bsse0198',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  }
}));

// CORS configuration
app.use(cors({
  origin: 'https://swiftlogix.cc',
  credentials: true
}));

// Body parser
app.use(express.json());

app.use('/api', RateCalculator);
app.use('/api', ScheduleaShip);
app.use('/api', BecomeCustomer);
app.use('/api', BecomeRider);
app.use('/api', EmployeeRoute);
app.use('/api', InsuranceRoute);


app.get('/home', (req, res) => {
  res.send("Backend running....")
});


io.on('connection', (socket) => {
  // When user registers a tracking ID, they join a room for that ID
  socket.on('register', (trackingId) => {
    socket.join(trackingId);
  });

  // Receive location updates from client with list of transitShipments
  socket.on('send-location', async ({ coordinates, transitShipments }) => {
    const now = new Date();
    const datetime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

    await Promise.all(
      transitShipments.map(async (shipment) => {
        
        await Route.updateOne(
          { trackingid: shipment.trackingid },
          { $set: { coordinates, datetime } },
          { upsert: true }
        );

        io.to(shipment.trackingid).emit('receive-location', {
          id: socket.id,
          coords: coordinates,
          trackingid: shipment.trackingid,
          datetime,
        });
      })
    );
  });

  socket.on('disconnect', () => {
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
