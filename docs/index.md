# SIMPLE REACT ROUTING

## Overview

The Simple React Router is a lightweight and fast library for ReactJS, it allows developers to create routing for their Single Page Applications (SPAs) without the need for a complex router.

## Basic Usage

Install package with `npm install` or `yarn add`.

Create a routes object like:

```tsx
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

```jsx
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

```jsx
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

**Modifier key behavior:** If the user clicks a link while holding Ctrl (or Cmd/Meta on macOS), the library preserves the browser's default behavior (for example opening the link in a new tab). In that case `navigateTo` will return early and will not call `event.preventDefault()` or `history.pushState()`. This makes Ctrl/Cmd-clicks behave like normal browser links.

**Important:** The hook `useNavigation()` depends on BrowserRouter context, so it can only be used inside \<BrowserRouter/\>

## RegExp Params

It is a common concept to use RegExp validation on paths to not allow users to enter an invalid location, or even to just automatically return a NotFoundPage based on the validation.

To create path parameters you need the prefix colon (:) and the name of the parameter, like: `products/:id`

You can add more restrict path parameters by using RegExp like: `products/:id(number)` which number means /[0-9]+/

To create your own type RegExp validation you need to register it at the root of your project, before using the BrowserRouter component.

Imagine you want to add a GUID (with hyphen) validation:

```tsx
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

The Simple React Router will not magically resolve the conflicts because there is no guarantee that it will always work.

So let the developer decide for the library:

```tsx
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

Higher priority means the RegExp will be tested first, so you can sort them yourself and resolve the sorting problem.


## Hooks

Use the `useRouter()` hook to get data of the current route like: component, path params and route list.

### Get pathParams

Imagine you have the `/route/:id` route and you want to get the `id` parameter value, you can just call the hook and use the `pathParams` attribute:

```jsx
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

```jsx
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

```jsx
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
Link component creates an anchor element with all specific attributes, It makes it easy to create navigation anchors without creating your own component.

```jsx
<Link to="/my-route">Click here</Link>
```

It generates an anchor element with href being your target destination and provides default onclick behavior.

You can pass any anchor's attribute like `className`, `id` etc.


## Named Route navigation

You can name your routes for more flexible development. So you don't need to explicitly pass the full path to navigate through routes. You can identify the route with a unique name, so it creates a more maintainable application (if some route changes, you wouldn't need to change all navigation that relies on that route).

To name your route just pass the name attribute

```tsx
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

```jsx
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