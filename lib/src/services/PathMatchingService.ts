import { Route, Routes, TypeParameterDictionary } from "../types";

const matchRegex = /:[\w\-][a-z0-9]+([(][\w\-][a-z0-9]+[)])?/;

const registeredTypes = {
    "any": /([\w\-\+%]+)/
} as TypeParameterDictionary;

const combine = (...params: string[]) => {
    return params.join("/");
}

const generateMatcher = (fullpath: string) => {
    const pathParams = getParams(fullpath);
    let matcher = "^" + fullpath + "$";
    pathParams.forEach((p) => {
        matcher = matcher.replace(matchRegex, (registeredTypes[p.type] || registeredTypes["any"]).source);
    });
    return new RegExp(matcher);
}


const getParams = (fullpath: string) => {
    const pathParams = fullpath.match(/:[\w\-][a-z0-9]+([(][\w\-][a-z0-9]+[)])?/g);
    const paramsResult = [] as any[];
    if (pathParams) {
        pathParams.map((v, i) => {
            let _ = v.match(/^:([\w\-]*[a-z0-9])([(]([\w\-]*[a-z0-9])[)])?/);
            if (_) {
                let name = _[1];
                let type = _[3] || "any";
                const param = {
                    name,
                    type,
                    index: i
                };
                paramsResult.push(param);
            }
        });
    }
    return paramsResult;
}

const registerTypeParameter = (name: string, regex: RegExp) => {
    registeredTypes[name] = new RegExp("(" + regex.source + ")");
}



let pathDictionary = {} as any;

let matchers = [] as any[];

const pathMatchPattern = {
    getPathDictionary: () => {
        return { ...pathDictionary };
    },
    configure: function (routes: Routes) {
        pathDictionary = {};
        const mapRecursive = (route: Route, parent = "") => {
            let parentPath = combine(parent || "", route.path);
            if (route.children) {
                route.children.forEach((child) =>
                    mapRecursive(child, parentPath));
            }
            pathDictionary[parentPath] = {
                ...route,
                priority: route.priority || 0,
                matcher: generateMatcher(parentPath),
                children: undefined
            };
            matchers.push(pathDictionary[parentPath]);
        }
        routes.forEach((r) => mapRecursive(r));
        matchers.sort((a, b) => b.priority - a.priority); // order by descending
    },

};

const getComponentAlgorithm = (path: string) => {
    return matchers.find(e => path.match(e.matcher));
}

const getComponentFromRoute = (path = window.location.pathname): Route => {
    const result = pathDictionary[path];
    if (!result) {

    }
    return result;
}

export default pathMatchPattern;

export { getParams, generateMatcher, registerTypeParameter };