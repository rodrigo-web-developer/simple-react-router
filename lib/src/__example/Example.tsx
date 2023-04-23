import BrowserRouter from "../components/BrowserRouter"
import { Routes } from "../types";
import Layout from "./pages/Layout";

import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";

import Regex1 from "./components/Regex1";
import Regex2 from "./components/Regex2";
import Regex3 from "./components/Regex3";

import Subpage1 from "./pages/subpages/Subpage1";
import { registerPathTypeParameter } from "../services/PathMatchingService";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

registerPathTypeParameter("guid", /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9A-Fa-f]{4}-[0-9a-f]{12}/);

const myRoutes = [{
    component: <Home/>,
    path: "",
},{
    component: <Page1></Page1>,
    path: "pagina1",
    children: [{
        path: "subpage", //create /pagina1/subpage
        component: <Subpage1></Subpage1> 
    }]
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
}, {
    component: <Regex3></Regex3>,
    path: "product/:test(guid)"
}] as Routes;

export default function Example() {
    return (
        <BrowserRouter routes={myRoutes} notFoundPage={<NotFound/>}>
            <Layout></Layout>
        </BrowserRouter>
    )
}
