
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProvidersApp from "./provedores";
import ProductosPage from "./productos";
import Herramientas from "./herramientas";


const router = createBrowserRouter([

    {
        path: "/providers",
        element: <ProvidersApp />,
    },
    {
        path: "/productos",
        element: <ProductosPage />,
    },
    {
        path: "/herramientas",
        element: <Herramientas />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
