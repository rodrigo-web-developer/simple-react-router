import { useRouter } from "../../hooks";
import React from "react"

export default function MySecondPage() {
    console.log("rendering Regex1");
    const { pathParams } = useRouter();

    return (<>
        <h1>
            RECEBENDO PARAMETRO TEXTO QUALQUER
        </h1>
        <h2>rota: /rota/:texto</h2>
        <h3>valor: {pathParams["texto"]}</h3>
    </>)
}