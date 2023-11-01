import { createRoot } from 'react-dom/client';
import Print from "./routes/Print"
import Settings from "./routes/Settings"
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import { ConfigProvider } from "antd";

const router = createHashRouter([
    {
        path: "/",
        element: <Print />
    },
    {
        path: "/settings",
        element: <Settings />
    }
])

const root = createRoot(document.body);

root.render(<div id="app">
    <ConfigProvider theme={{ token: { colorPrimary: "#3b97d3" }, components: { Progress: { defaultColor: "#3b97d3" } } }}>
        <RouterProvider router={router} />
    </ConfigProvider>
</div>);
