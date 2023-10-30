import { createRoot } from 'react-dom/client';
import Print from "./routes/Print"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { ConfigProvider } from "antd";

const router = createBrowserRouter([
    {
        path: "/main_window",
        element: <Print />
    }
])

const root = createRoot(document.body);

root.render(<div id="app">
    <ConfigProvider theme={{ token: { colorPrimary: "#3b97d3" } }}>
        <RouterProvider router={router} />
    </ConfigProvider>
</div>);
