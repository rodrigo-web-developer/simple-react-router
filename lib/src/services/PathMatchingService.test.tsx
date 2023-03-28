import React from "react";
import service from "./PathMatchingService";

it("Service must create correct object by configuration", () => {
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

    const dict = service.pathDictionary;

    expect(dict).toEqual({
        "/route1": component1,
        "/route1/nest1": component1,
        "/route1/nest2": component1,
    })
});