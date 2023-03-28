import React from "react";
import service, { generateMatcher, getParams, registerTypeParameter } from "./PathMatchingService";

it("configure() must create correct object with routes", () => {
    const component1 = <h1>TEST</h1>;
    const routes = [{
        path: "route1",
        component: component1,
        children: [{
            path: "nest1",
            component: component1,
        }, {
            path: "nest2",
            component: component1,
        }]
    }];

    service.configure(routes);

    const dict = service.getPathDictionary();

    expect(dict).toEqual({
        "/route1": component1,
        "/route1/nest1": component1,
        "/route1/nest2": component1,
    })
});

it("getParams should return array of params for simple route", () => {
    const route1 = "/app/test";
    const route2 = "/app/:id";
    const route3 = "/app/:id(guid)/:op";

    const response1 = getParams(route1);
    const response2 = getParams(route2);
    const response3 = getParams(route3);

    expect(response1).toEqual([]);
    expect(response2).toEqual([{ name: "id", type: "any", index: 0 }]);
    expect(response3).toEqual([{ name: "id", type: "guid", index: 0 }, { name: "op", type: "any", index: 1 }]);
});


it("generateMatcher should return regexp for path matching on simple route", () => {
    const route1 = "/app/test";
    const route2 = "/app/:id";
    const route3 = "/app/:id(numero)";

    registerTypeParameter("numero", /[0-9]+/)
    const response1 = generateMatcher(route1);
    const response2 = generateMatcher(route2);
    const response3 = generateMatcher(route3);

    expect(response1).toEqual(new RegExp(route1));
    expect(response2).toEqual(new RegExp("/app/([\\w\\-\\+%]+)"));
    expect(response3).toEqual(new RegExp("/app/([0-9]+)"));
});