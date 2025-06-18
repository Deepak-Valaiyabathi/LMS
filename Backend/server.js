// server.js
import Hapi from '@hapi/hapi';
import { employeeRoutes } from './src/routes/employeeRoute.js'; 
import dotenv from 'dotenv';
import { leaveRoute } from './src/routes/leaveRoute.js';
import { authMiddleware } from './src/middleware/authMiddleWare.js';
dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
        credentials: true
      }
    }
  });

  // server.ext('onPreAuth', authMiddleware); 
  

  server.route(employeeRoutes);
  server.route(leaveRoute);
  
  await server.start();
};

init();
