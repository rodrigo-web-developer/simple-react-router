import React from "react";

type Routes = Route[];

export interface Route {
    children?: Routes;
    path: string;
    name?: string;
    component: JSX.Element;
    priority?: number;
}

export interface TypeParameterDictionary {
    [key: string]: RegExp
};

export interface MatchersDictionary {
    [key: string]: RouteMatcher
};

export interface RouteBase {
    path: string;
    name: string;
    component: JSX.Element,
    priority?: number,
    _fullpath: string;
    config: Route;
    params?: {
        name: string,
        type: string,
        index: number
    }[]
}

export interface RouteMatcher extends RouteBase {
    matcher: RegExp;
    type: "normal" | "regexp" | "wildcard"
}

interface StringDictionary { [key: string]: string }

export type { Routes, StringDictionary };