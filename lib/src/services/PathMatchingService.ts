import { MatchersDictionary, Route, RouteBase, RouteMatcher, Routes, StringDictionary, TypeParameterDictionary } from "../types";
import { classifyPath, sortAlgorithm } from "./utilService";

const matchRegex = /:[\w\-][a-z0-9]+([(][\w\-][a-z0-9]+[)])?/;

const registeredTypes = {
    "any": /([\w\-\+%]+)/,
    "number": /([0-9]+)/
} as TypeParameterDictionary;


const combine = (...params: string[]) => {
    return params.join("/");
}

const generateMatcher = (fullpath: string) => {
    const pathParams = getParams(fullpath);
    let matcher = "^" + fullpath + "\/?$";
    pathParams.forEach((p) => {
        matcher = matcher.replace(matchRegex, (registeredTypes[p.type] || registeredTypes["any"]).source);
    });
    return new RegExp(matcher);
}

const getParams = (fullpath: string) => {
    const pathParams = fullpath.match(/:[\w\-][a-z0-9]+([(][\w\-][a-z0-9]+[)])?/g);
    const paramsResult = [] as any[];
    if (pathParams) {
        // console.log(fullpath, pathParams);
        pathParams.forEach((v, i) => {
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
        // console.log("Results: ", paramsResult);
    }
    return paramsResult;
}

const getParamsValues = function (route: RouteMatcher, fullpath: string = window.location.pathname): StringDictionary {
    const dict = {} as StringDictionary;
    if (route.params.length) {
        const paramsValues = route.matcher.exec(fullpath);
        route.params.forEach(p => {
            dict[p.name] = paramsValues[p.index + 1];
        });
    }
    return dict;
}

const registerPathTypeParameter = (name: string, regex: RegExp) => {
    registeredTypes[name] = new RegExp("(" + regex.source + ")");
}

let pathDictionary = {} as MatchersDictionary;

let matchers = [] as RouteMatcher[];

const pathMatchPattern = {
    getPathDictionary: () => {
        return { ...pathDictionary };
    },
    configure: function (routes: Routes) {
        pathDictionary = {};
        const mapRecursive = (route: Route, parent = "") => {
            let fullPath = combine(parent || "", route.path);
            if (route.children) {
                route.children.forEach((child) =>
                    mapRecursive(child, fullPath));
            }
            pathDictionary[fullPath] = {
                component: route.component,
                path: route.path,
                type: classifyPath(fullPath),
                priority: route.priority || 0,
                matcher: generateMatcher(fullPath),
                params: getParams(fullPath)
            };
            matchers.push(pathDictionary[fullPath]);
        }
        routes.forEach((r) => mapRecursive(r));
        matchers.sort(sortAlgorithm); // order by descending
    },

};

const getComponentAlgorithm = (path: string) => {
    return matchers.find(e => path.match(e.matcher));
}

const getComponentFromRoute = (path = window.location.pathname): RouteMatcher | undefined => {
    let result = pathDictionary[path];

    if (!result) {
        result = getComponentAlgorithm(path);
    }
    return result;
}

export default pathMatchPattern;

export {
    getParams,
    generateMatcher,
    registerPathTypeParameter,
    getComponentFromRoute,
    getParamsValues
};