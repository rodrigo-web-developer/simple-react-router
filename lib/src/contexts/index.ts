import React, { PropsWithChildren, ReactNode, createContext } from "react";
import { Routes, StringDictionary } from "../types";

interface RouterContext {
    routes: Routes,
    component?: React.ReactElement | JSX.Element | ReactNode | React.FC,
    pathParams: StringDictionary
};

const RouterContext = createContext({} as RouterContext);

interface NavigationContext {
    navigateTo: (e: React.UIEvent<Element> | null, path: string, state?: any) => void;
    navigateToRoute: (e: React.UIEvent<Element> | null, routeName: string, routeParams?: StringDictionary, state?: any) => void,
    path: string
};

const NavigationContext = createContext({} as NavigationContext);

export { RouterContext, NavigationContext };