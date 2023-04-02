import { RouteMatcher } from "../types";
import { classifyPath, sortAlgorithm } from "./utilService";

it("should sort routes by algorithm", () => {
    let route1 = "/routes",
        route2 = "/routes/:text",
        route3 = "/routes/:id(number)",
        route4 = "/routes/test";

    const routes = [{
        path: route1,
        type: classifyPath(route1)
    }, {
        path: route2, // regexp,
        type: classifyPath(route2)
    }, {
        path: route3, // regexp,
        type: classifyPath(route3),
        priority: 1
    }, {
        path: route4, // regexp,
        type: classifyPath(route4)
    }] as RouteMatcher[];

    expect(routes[0].type).toBe("normal");
    expect(routes[1].type).toBe("regexp");
    expect(routes[2].type).toBe("regexp");
    expect(routes[3].type).toBe("normal");

    routes.sort(sortAlgorithm);

    expect(routes[0].path).toBe(route1);
    expect(routes[1].path).toBe(route4);
    expect(routes[2].path).toBe(route3);
    expect(routes[3].path).toBe(route2);
});