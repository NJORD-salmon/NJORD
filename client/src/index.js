import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './styles.css'
import App from './routes/App'
import Water from './routes/Aquarium'
import Visualizer from './routes/Visualizer'

const waterPath = process.env.NODE_ENV === 'production'
  ? '/'
  : '/aquarium'


const router = createBrowserRouter(
  [
    {
      path: waterPath,
      element: <Water />
    },
    {
      path: "/configurator",
      element: <App />,
    },
    {
      path: "/visualizer",
      element: <Visualizer />,
    },
  ],
  { basename: '/NJORD' }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);