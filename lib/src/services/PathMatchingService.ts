import { Route, Routes } from "../types";

const combine = (...params: string[]) => {
    return params.join("/");
}

const pathMatchPattern = {
    pathDictionary: {} as any,
    configure: function (routes: Routes) {
        const mapRecursive = (route: Route, parent = "") => {
            let parentPath = combine(parent || "", route.path);
            if (route.children) {
                route.children.forEach((child) =>
                    mapRecursive(child, parentPath));
            }
            this.pathDictionary[parentPath] = route.component;
        }
        routes.forEach((r) => mapRecursive(r));
    }
};

export default pathMatchPattern;