import { RouteMatcher } from "../types";

const matchersSequence = {
    "normal": 2,
    "regexp": 1,
    "wildcard": 0
};

/**
 * Sorts the matchers based on type and priority. Following the rules:
 * 
 * 1 - Matchers has 3 types: normal, regexp and wildcard
 * 
 * 2 - Matchers of the same type are sorted by priority
 * 
 * 3 - Matchers of type normal are tested before regexp matchers
 * 
 * 4 - Regexp matchers are tested before wildcard matchers
 * 
 * @param a 
 * @param b 
 * @returns return 0, -1 or 1 to sort the matchers
 */
const sortAlgorithm = function (a: RouteMatcher, b: RouteMatcher): number {
    let result = 0;
    let priorityA = a.priority || 0, priorityB = b.priority || 0;

    if (a.type !== b.type) {
        result = matchersSequence[b.type] - matchersSequence[a.type];
    }
    else {
        result = priorityB - priorityA;
    }
    return result;
}

const classifyPath = function (path: string): "normal" | "regexp" | "wildcard" {
    if (path.includes("**")) {
        return "wildcard";
    }
    else if (path.match(/:([\w\-]*[a-z0-9])/)) {
        return "regexp";
    }
    return "normal";
}

export { sortAlgorithm, classifyPath };