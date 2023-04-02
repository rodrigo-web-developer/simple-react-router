import { ReactElement, useEffect, useState } from "react";
import Link from "../../components/Link";
import { useRouter } from "../../hooks";
import "../styles/app.css";

export default function Layout(){
    const router = useRouter();

    return (<div className="layout">
        <nav>
            <ul>
                <li><Link to="/pagina1">IR PARA PAGINA 1</Link></li>
                <li><Link to="/pagina2">IR PARA PAGINA 2</Link></li>
                <li><Link to="/pagina3">IR PARA PAGINA 3</Link></li>
                <li><Link to="/rota/textonormal">PAGINA COM REGEX</Link></li>
                <li><Link to="/rota/123456">PAGINA COM REGEX</Link></li>
                <li><Link to="/rota/teste">PAGINA SEM REGEX</Link></li>
            </ul>
        </nav>
        <div>
            {router.component}
        </div>
    </div>)
}