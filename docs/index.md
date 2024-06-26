# SIMPLE REACT ROUTING

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
import { BrowserRouter, RenderComponent } from "simple-react-routing";

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

## Navigation
You can use navigation functions by calling `useNavigation()` hook, it allows you to pass the dispatched event and the target location:

```ts
import { useNavigation } from "simple-react-routing";

export default function MyPage() {

    const { navigateTo } = useNavigation();

    const goToAnotherPage = (e) => {
        navigateTo(e, "/another-page");
    }

    return (
        <div>
            <h1>My page</h1>
            <button onClick={goToAnotherPage}>Go to Page</button>
        </div>
    )
}
```

If you don't have an event object, you can pass null.

**Important:** The hook `useNavigation()` depends on BrowserRouter context, so it can only be used inside \<BrowserRouter/\>

## RegExp Params

It is a common concept use RegExp validation on path to not allow users to entry an invalid location, or even to just automatically returns a NotFoundPage based on the validation.

To create path parameters you need the prefix colon (:) and the name of the parameter, like: `products/:id`

You can add more restrict path parameters by using RegExp like: `products/:id(number)` which number means /[0-9]+/

To create you own type RegExp validation you need to register at the root of your project, before using BrowserRouter component.

Imagine you want to add a GUID (with hiphen) validation:

```ts
import { registerPathTypeParameter } from "simple-react-routing";

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
import { registerPathTypeParameter } from "simple-react-routing";

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
import { useRouter } from "simple-react-routing";

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
import { BrowserRouter } from "simple-react-routing";

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
import { RenderComponent, Link } from "simple-react-routing";

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

## Link component
Link component creates an anchor element with all specific attributes, it make easy to create navigation anchors without creating your own component.

```jsx
<Link to="/my-route">Click here</Link>
```

It generates an anchor element with href being your target destination and provides default onclick behavior.

You can pass any anchor's attribute like `className`, `id` etc.


## Named Route navigation

You can name your routes to more flexible development. So you dont need to explicit pass the full path to navigate through routes. You can identify the route with a unique name, so it creates a better maintainable application (if some route changes, it wouldn't be need to change all navigation that relays on that route).

To name your route just pass the name attribute

```ts
import { registerPathTypeParameter } from "simple-react-routing";

registerPathTypeParameter("guid", /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9A-Fa-f]{4}-[0-9a-f]{12}/);

const myRoutes = [{
    component: <Page1></Page1>,
    path: "page1",
    name: "main-page",
    children: [{
        path: "subpage", //it creates: /page1/subpage
        component: <Subpage1></Subpage1>,
        name: "first-page",
    }]
}, {
    component: <Page3></Page3>,
    path: "product/:id(guid)", // use the name of type parameter registered
    name: "product-details"
}] as Routes;

export default myRoutes;
```

Which will identify the routes by name, so you can call the `navigateToRoute` function from `useNavigation()` hook:

```tsx
import { useNavigation } from "simple-react-routing";

export default function MyComponent() {
    const navigator = useNavigation();

    const redirectToMainPage = useCallback((e) => {
        navigator.navigateToRoute(e, "main-page");
    }, [navigator]);

    const redirectToProduct = useCallback((e) => {
        navigator.navigateToRoute(e, "product-details",
        {
            "id": "ef4c3e47-f747-43ef-8962-1557caa5f8fa"
        });
    }, [navigator]);

    return (<div className="my-page">
            <a href="" onClick={(e) => redirectToMainPage(e)}>Go to Home</a>
            <a href="" onClick={(e) => redirectToProduct(e)}>Check Product Details</a>
    </div>);
}
```