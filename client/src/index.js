import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './styles.css'
import App from './routes/App'
import Water from './routes/Aquarium'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Water />
  },
  {
    path: "/configurator",
    element: <App />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);