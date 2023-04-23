import React from "react";
import Link from "../../components/Link";
import "../styles/app.css";
import { RenderComponent } from "../../components/BrowserRouter";

export default function Layout() {
    return (<div className="layout">
        <nav>
            <ul>
                <li><Link to="/pagina1">IR PARA PAGINA 1</Link></li>
                <li><Link to="/pagina2">IR PARA PAGINA 2</Link></li>
                <li><Link to="/pagina3">IR PARA PAGINA 3</Link></li>
                <li><Link to="/rota/textonormal">PAGINA COM REGEX</Link></li>
                <li><Link to="/rota/123456">PAGINA COM REGEX</Link></li>
                <li><Link to="/rota/teste">PAGINA SEM REGEX</Link></li>
                <li><Link to="/404">PAGINA SEM REGISTRO</Link></li>

            </ul>
        </nav>
        <div className="content">
            <RenderComponent/>
        </div>
    </div>)
}