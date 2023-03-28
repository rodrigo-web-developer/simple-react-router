import React from "react";

type Routes = Route[];

export interface Route {
    path: string;
    component: React.ReactElement,
    children?: Routes
}

export type { Routes };