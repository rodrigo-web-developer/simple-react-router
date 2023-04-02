import React, { PropsWithChildren, createContext } from "react";
import { Routes } from "../types";

interface RouterContext {
    routes: Routes,
    component?: JSX.Element,
    setErrorPage: (c: JSX.Element) => void
};

const RouterContext = createContext({} as RouterContext);

interface NavigationContext {
    navigateTo: (e: React.UIEvent<Element>, path: string) => void,
    path: string
};

const NavigationContext = createContext({} as NavigationContext);


export { RouterContext, NavigationContext };