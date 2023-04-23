import React from "react";
import service, { generateMatcher, getComponentFromRoute, getParams, getParamsValues, registerPathTypeParameter } from "./PathMatchingService";

it("must create correct object with routes", () => {
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

    expect(Object.keys(dict).sort()).toEqual([
        "/route1",
        "/route1/nest1",
        "/route1/nest2",
    ].sort())
});

it("should return array of params for simple route", () => {
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


it("should return regexp for path matching on simple route", () => {
    const route1 = "/app/test";
    const route2 = "/app/:id";
    const route3 = "/app/:id(numero)";

    registerPathTypeParameter("numero", /[0-9]+/)
    const response1 = generateMatcher(route1);
    const response2 = generateMatcher(route2);
    const response3 = generateMatcher(route3);

    expect(response1).toEqual(new RegExp("^" + route1 + "\/?$"));
    expect(response2).toEqual(new RegExp("^/app/([\\w\\-\\+%]+)\/?$"));
    expect(response3).toEqual(new RegExp("^/app/([0-9]+)\/?$"));
});

it("returns first match component by path", () => {
    const component1 = <h1></h1>;
    const component2 = <h2></h2>;
    const component3 = <h3></h3>;
    const routes = [{
        path: "route",
        component: component1,
        children: [{
            path: ":id",
            component: component3,
        }, {
            path: "nest1",
            component: component2,
        }]
    }];

    service.configure(routes);

    const result1 = getComponentFromRoute("/route/abc");
    const result2 = getComponentFromRoute("/route/nest1");
    const resultRoot = getComponentFromRoute("/route");

    expect(result1!.component).toBe(component3);
    expect(result2!.component).toBe(component2);
    expect(result1!.params).toEqual([{
        name: "id",
        type: "any",
        index: 0
    }]);
    expect(resultRoot!.component).toBe(component1);
});


it("should return dictionary of params values", () => {
    const component1 = <h1>1</h1>;
    const component3 = <h3>2</h3>;
    const routes = [{
        path: "route",
        component: component1,
        children: [{
            path: ":id",
            component: component3,
        }]
    }];

    service.configure(routes);

    const result1 = getComponentFromRoute("/route/abcd");

    expect(result1!.params).toEqual([{
        name: "id",
        type: "any",
        index: 0
    }]);

    const values = getParamsValues(result1, "/route/abcd");

    expect(values).toEqual({
        "id": "abcd"
    })
});


it("should return dictionary of params values with nested routes", () => {
    const component1 = <h1>1</h1>;
    const component3 = <h3>2</h3>;
    const nestedRoutes = [{
        path: ":path",
        component: component1,
        children: [{
            path: ":id",
            component: component3,
        }]
    }];

    service.configure(nestedRoutes);

    const result1 = getComponentFromRoute("/nested/route");
    
    expect(result1!.params).toEqual([{
        name: "path",
        type: "any",
        index: 0
    }, {
        name: "id",
        type: "any",
        index: 1
    }]);

    const values = getParamsValues(result1, "/nested/route");

    expect(values).toEqual({
        "path": "nested",
        "id": "route"
    });
});