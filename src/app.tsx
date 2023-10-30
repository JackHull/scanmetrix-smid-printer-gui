import { createRoot } from 'react-dom/client';
import packageJSON from "../package.json"

const root = createRoot(document.body);
root.render(<h2>Hello from React! Version: {packageJSON.version}</h2>);
