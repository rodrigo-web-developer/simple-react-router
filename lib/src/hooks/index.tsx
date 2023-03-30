import { Context, createContext, useCallback, useContext, useEffect, useState } from "react"
import { Routes } from "../types";
import service, { getComponentFromRoute } from "../services/PathMatchingService";

interface RouterContext {
    routes: Routes,
    renderComponent: () => React.ReactElement,
    setErrorPage: (c: React.ReactElement) => void
};

const context = createContext({} as RouterContext);

interface BrowserRouterProps {
    routes: Routes
}

export const BrowserRouter = ({ routes }: BrowserRouterProps) => {
    const [notFound, setNotFound] = useState<React.ReactElement>();

    const setErrorPage = useCallback((e: React.ReactElement) => {
        setNotFound(e);
    }, []);

    const renderComponent = useCallback(() => {
        const currentRouteComponent = getComponentFromRoute(window.location.pathname);
        if (!currentRouteComponent) {
            return notFound;
        }
        return currentRouteComponent.component;
    }, []);

    useEffect(() => {
        service.configure(routes);
    }, [routes]);

    return <context.Provider value={{
        setErrorPage,
        routes,
        renderComponent
    }}></context.Provider>
}

export const useRouter = (): RouterContext => {
    const routerContext = useContext(context);
    return routerContext;
}