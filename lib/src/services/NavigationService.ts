
const navigationService = {
    _listeners: [] as Function[],
    get pathname() {
        return window.location.pathname;
    },
    navigateTo: function (event: Event, path: string) {
        event && event.preventDefault(); // impede que a tag "a" ao ser clicada redirecione a pagina
        window.history.pushState("", "", path); // troco apenas a url sem redirecionar
        navigationService.handleOnChange(event);
    },
    onChangeRoute: function (action: Function) {
        this._listeners.push(action);
    },
    handleOnChange: function (e: Event) {
        this._listeners.forEach(
            handle => handle(e)
        )
    }
};

if (typeof window !== "undefined") {
    window.addEventListener("popstate", (e) => navigationService.handleOnChange(e));
}

export default navigationService;