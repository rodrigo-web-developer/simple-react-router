import { UIEvent } from "react";
import { StringDictionary } from "types";
import { getFullPath } from "./PathMatchingService";

const navigationService = {
    _listeners: {} as any,
    get pathname() {
        return window.location.pathname;
    },
    navigateTo: function (event: UIEvent<Element> | null, path: string, state: any = null) {
        event && event.preventDefault(); // impede que a tag "a" ao ser clicada redirecione a pagina
        window.history.pushState(state, "", path); // troco apenas a url sem redirecionar
        navigationService.handleOnChange(event);
    },
    navigateToRoute: function (event: UIEvent<Element> | null, routeName: string, routeParams: StringDictionary, state: any = null) {
        const fullpath = getFullPath(routeName, routeParams);
        this.navigateTo(event, fullpath, state);
    },
    onChangeRoute: function (handlerName: string, action: Function) {
        this._listeners[handlerName] = action;
    },
    removeHandler: function (handlerName: string) {
        delete this._listeners[handlerName];
    },
    handleOnChange: function (e: UIEvent<Element> | Event) {
        for (const handle of Object.keys(this._listeners)) {
            this._listeners[handle](e);
        }
    }
};

if (typeof window !== "undefined") {
    window.addEventListener("popstate", (e) => navigationService.handleOnChange(e));
}

export default navigationService;