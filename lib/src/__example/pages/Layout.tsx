import React, { useCallback } from "react";
import Link from "../../components/Link";
import "../styles/app.css";
import { RenderComponent } from "../../components/BrowserRouter";
import { useNavigation } from "../../hooks";
import { getFullPath } from "../../services/PathMatchingService";

export default function Layout() {
    const navigator = useNavigation();
    const rota2 = getFullPath("rota-id", {
        id: "12346"
    })
    const redirectToProduct = useCallback((e) => {
        navigator.navigateToRoute(e, "product-details",
            {
                "test": "ef4c3e47-f747-43ef-8962-1557caa5f8fa"
            }, {
                id: "teste" 
            }
        );
    }, [navigator]);

    return (<div className="layout">
        <nav>
            <ul>
                <li><Link to="/pagina1">IR PARA PAGINA 1</Link></li>
                <li><Link to="/pagina2">IR PARA PAGINA 2</Link></li>
                <li><Link to="/pagina3">IR PARA PAGINA 3</Link></li>
                <li><Link to="/rota/textonormal">PAGINA COM REGEX</Link></li>
                <li><Link to={rota2}>PAGINA COM REGEX</Link></li>
                <li><Link to="/rota/teste">PAGINA SEM REGEX</Link></li>
                <li><Link to="/404">PAGINA SEM REGISTRO</Link></li>
                <li><a href="" onClick={(e) => redirectToProduct(e)}>PAGINA REGEX TIPO GUID</a></li>
            </ul>
        </nav>
        <div className="content">
            <RenderComponent />
        </div>
    </div>)
}