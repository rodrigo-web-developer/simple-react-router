# SIMPLE REACT ROUTER

## Overview

## Basic Usage

## RegExp Params

## RegExp Params conflicts resolve

## Hooks

## RenderComponent with layout

There is only 1 component you need to use to render the specific component from routing, so it is easy to set the Layout around the route.

Being the App.tsx:

```ts
import { BrowserRouter } from "simple-react-router";

import { Layout } from "./pages";

import myRoutes from "./routes";

export default function Example() {
    return (
        <BrowserRouter routes={myRoutes}>
            <Layout></Layout>
        </BrowserRouter>
    )
}
```

And the Layout.tsx can be like: 

```ts
import React from "react";
import { RenderComponent, Link } from "simple-react-router";

export default function Layout() {
    return (<div className="layout">
        <nav>
            <ul>
                <li><Link to="/page1">PAGE 1</Link></li>
                <li><Link to="/page2">PAGE 2</Link></li>
                <li><Link to="/page3">PAGE 3</Link></li>
            </ul>
        </nav>
        <div className="content">
            <RenderComponent/>
        </div>
    </div>)
}
```

where &lt;RenderComponent/&gt; is the component which will render based on router definition.
