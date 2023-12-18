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


const router = createBrowserRouter(
  [
    {
      path: "/",
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