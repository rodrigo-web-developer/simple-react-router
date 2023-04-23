import React from "react";

type Routes = Route[];

export interface Route extends RouteBase {
    children?: Routes
}

export interface TypeParameterDictionary {
    [key: string]: RegExp
};

export interface MatchersDictionary {
    [key: string]: RouteMatcher
};

export interface RouteBase {
    path: string;
    component: JSX.Element,
    priority?: number,
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