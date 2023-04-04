import React, { PropsWithChildren, ReactNode, createContext } from "react";
import { Routes } from "../types";

interface RouterContext {
    routes: Routes,
    component?: React.ReactElement | JSX.Element | ReactNode | React.FC
};

const RouterContext = createContext({} as RouterContext);

interface NavigationContext {
    navigateTo: (e: React.UIEvent<Element>, path: string) => void,
    path: string
};

const NavigationContext = createContext({} as NavigationContext);


export { RouterContext, NavigationContext };