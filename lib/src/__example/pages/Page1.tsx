import React from "react";
import Link from "../../components/Link";

export default function MyFirstPage() {
    return (<>
        <h1>
            HEY, THIS IS MY 1st PAGE
        </h1>
        <Link to="/pagina1/subpage">Navigate to subpage</Link>
    </>
    )
}