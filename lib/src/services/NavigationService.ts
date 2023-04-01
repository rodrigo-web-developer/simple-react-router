import { UIEvent } from "react";

const navigationService = {
    _listeners: {} as any,
    get pathname() {
        return window.location.pathname;
    },
    navigateTo: function (event: UIEvent<Element>, path: string) {
        event && event.preventDefault(); // impede que a tag "a" ao ser clicada redirecione a pagina
        window.history.pushState("", "", path); // troco apenas a url sem redirecionar
        navigationService.handleOnChange(event);
    },
    onChangeRoute: function (handlerName: string, action: Function) {
        this._listeners[handlerName] = action;
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