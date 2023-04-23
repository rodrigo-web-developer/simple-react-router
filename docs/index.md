# SIMPLE REACT ROUTER

## Overview

The Simple React Router is a lightweight and fast library for ReactJS, it allows developers to create routing for their applications without the need for a complex router.

## Basic Usage

Install package with `npm install` or `yarn add`.

Create a routes object like:

```ts
const myRoutes = [{
    component: <Page1></Page1>,
    path: "page1",
    children: [{
        path: "subpage", //it creates: /page1/subpage
        component: <Subpage1></Subpage1> 
    }]
}, {
    component: <Page2></Page2>,
    path: "page2"
}, {
    component: <Page3></Page3>,
    path: "page3"
}] as Routes;

export default myRoutes;
```

Add the following instruction to the root of your project or the root of your component routing:

```ts
import { BrowserRouter, RenderComponent } from "simple-react-router";

import myRoutes from "./routes";

export default function Example() {
    return (
        <BrowserRouter routes={myRoutes}>
            <h1>Router configured</h1>
            <RenderComponent />
        </BrowserRouter>
    )
}
```

BrowserRouter will create a context for routing, and you can easily access and navigate to routes using the `useRouter()` hook inside any component directly or not directly child of BrowserRouter node.

## RegExp Params

It is a common concept use RegExp validation on path to not allow users to entry an invalid location, or even to just automatically returns a NotFoundPage based on the validation.

To create path parameters you need the prefix colon (:) and the name of the parameter, like: `products/:id`

You can add more restrict path parameters by using RegExp like: `products/:id(number)` which number means /[0-9]+/

To create you own type RegExp validation you need to register at the root of your project, before using BrowserRouter component.

Imagine you want to add a GUID (with hiphen) validation:

```ts
import { registerPathTypeParameter } from "simple-react-router";

registerPathTypeParameter("guid", /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9A-Fa-f]{4}-[0-9a-f]{12}/);

const myRoutes = [{
    component: <Page1></Page1>,
    path: "page1",
    children: [{
        path: "subpage", //it creates: /page1/subpage
        component: <Subpage1></Subpage1> 
    }]
}, {
    component: <Page3></Page3>,
    path: "product/:id(guid)" // use the name of type parameter registered
}] as Routes;

export default myRoutes;
```

## RegExp Params conflicts resolve

Let's imagine you have a /product/:id(guid) path and a /product/:description path, you will have problems with the conflict between :description and :id, because :description restriction contains :id restriction.

The Simple React Router will not magically resolves the conflicts because there is no guarantee that will always works.

So lets the developer decides for the library:

```ts
import { registerPathTypeParameter } from "simple-react-router";

registerPathTypeParameter("guid", /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9A-Fa-f]{4}-[0-9a-f]{12}/);

const myRoutes = [{
    component: <Page3></Page3>,
    priority: 1, // add to the top of matching test
    path: "product/:id(guid)" // use the name of type parameter registered
}, {
    component: <Page3></Page3>,
    path: "product/:description" 
}] as Routes;

export default myRoutes;
```

Higher priority means the regexp will be tested first, so you can just sorts yourself and resolve the sorting problem.


## Hooks

Use the `useRouter()` hook to get data of the current route like: component, path params and route list.

### Get pathParams

Imagine you have the `/route/:id` route and you want to get the `id` parameter value, you can just call the hook and use the `pathParams` attribute:

```ts
import { useRouter } from "simple-react-router";

export default function MyThirdPage() {
    const {pathParams} = useRouter();
    return (<>
        <h1>
            My ID: {pathParams["id"]}
        </h1>
    </>)
}
```

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