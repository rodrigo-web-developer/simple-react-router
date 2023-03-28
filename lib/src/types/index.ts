import React from "react";

type Routes = Route[];

export interface Route {
    path: string;
    component: React.ReactElement,
    children?: Routes,
    priority?: Number
}

export interface TypeParameterDictionary {
    [key: string]: RegExp
};

export type { Routes };