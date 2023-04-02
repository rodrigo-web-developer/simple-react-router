import BrowserRouter from "../components/BrowserRouter"
import { Routes } from "../types";
import Layout from "./pages/Layout";

import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";

import Regex1 from "./components/Regex1";
import Regex2 from "./components/Regex2";
import Regex3 from "./components/Regex3";

const myRoutes = [{
    component: <Page1></Page1>,
    path: "pagina1"
}, {
    component: <Page2></Page2>,
    path: "pagina2"
}, {
    component: <Page3></Page3>,
    path: "pagina3"
}, {
    component: <Regex1></Regex1>,
    path: "rota/:texto"
}, {
    component: <Regex2></Regex2>,
    path: "rota/:id(number)",
    priority: 1
}, {
    component: <Regex3></Regex3>,
    path: "rota/teste"
}] as Routes;

export default function Example() {
    return (
        <BrowserRouter routes={myRoutes}>
            <Layout></Layout>
        </BrowserRouter>
    )
}
