import React, { createContext } from "react";
import { Routes, StringDictionary } from "../types";

interface RouterContext {
    routes: Routes,
    component?: JSX.Element,
    pathParams: StringDictionary
};

const RouterContext = createContext({} as RouterContext);

interface NavigationContext {
    navigateTo: (e: React.UIEvent<Element>, path: string) => void,
    path: string
};

const NavigationContext = createContext({} as NavigationContext);


export { RouterContext, NavigationContext };