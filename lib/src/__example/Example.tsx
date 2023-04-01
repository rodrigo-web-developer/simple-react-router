import BrowserRouter from "../components/BrowserRouter"
import { Routes } from "../types";
import Layout from "./pages/Layout";

import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";

const myRoutes = [{
    component: <Page1></Page1>,
    path: "pagina1"
}, {
    component: <Page2></Page2>,
    path: "pagina2"
}, {
    component: <Page3></Page3>,
    path: "pagina3"
}] as Routes;

export default function Example() {
    return (
        <BrowserRouter routes={myRoutes}>
            <Layout></Layout>
        </BrowserRouter>
    )
}
