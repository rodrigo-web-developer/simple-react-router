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
let pathNameDictionary = {} as MatchersDictionary;

let matchers = [] as RouteMatcher[];

const pathMatchPattern = {
    getPathDictionary: () => {
        return { ...pathDictionary };
    },
    configure: function (routes: Routes) {
        pathDictionary = {};
        pathNameDictionary = {};
        const mapRecursive = (route: Route, parent = "") => {
            let fullPath = combine(parent || "", route.path);
            if (route.children) {
                route.children.forEach((child) =>
                    mapRecursive(child, fullPath));
            }
            route.name = route.name || fullPath;
            if (pathNameDictionary[route.name]) {
                throw new Error("You already defined a route with the same name: " + route.name);
            }
            pathNameDictionary[route.name] = pathDictionary[fullPath] = {
                component: route.component,
                name: route.name,
                path: route.path,
                config: route,
                type: classifyPath(fullPath),
                priority: route.priority || 0,
                matcher: generateMatcher(fullPath),
                params: getParams(fullPath),
                _fullpath: fullPath
            };
            matchers.push(pathDictionary[fullPath]);
        }
        routes.forEach((r) => mapRecursive(r));
        matchers.sort(sortAlgorithm); // order by descending
    }
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

const getComponentFromName = (routeName: string): RouteMatcher | undefined => {
    let result = pathNameDictionary[routeName];
    return result;
}
/**
 * Generate a path with params interpolated, if some path param is not present they will be replaced with empty string,
 * this function does not validate regex params, it just interpolates the values.
 * @param route the route generated from Router
 * @param params the dictionary of path params
 * @returns returns a string with the full path with interpolated params
 */
const setRouteParams = (route: RouteMatcher, params: StringDictionary): string => {
    let result = route._fullpath;
    Object.keys(params).forEach((key) => {
        if (params[key]) {
            const namedParam = route.params.find(e => e.name === key);
            if (namedParam) {
                const regex = new RegExp(
                    namedParam.type !== "any" ?
                        `:${key}[(]${namedParam.type}[)](?=$|/)` : // creates :id(number) match
                        `:${key}(?=$|/)` // creates :id match
                );
                result = result.replace(regex, params[key])
            }
        }
    });
    result = result.replace(/:[\w\-][a-z0-9]+([(][\w\-][a-z0-9]+[)])?/g, ""); // remove all params not set
    
    return result;
}

export default pathMatchPattern;

export {
    getParams,
    generateMatcher,
    registerPathTypeParameter,
    getComponentFromRoute,
    getParamsValues,
    getComponentFromName,
    setRouteParams
};