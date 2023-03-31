import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { RouterContext, NavigationContext } from "../../contexts";
import { useNavigation } from "../../hooks";
import navigationService from "../../services/NavigationService";
import service, { getComponentFromRoute } from "../../services/PathMatchingService";
import { Routes } from "../../types";

interface BrowserRouterProps {
    routes: Routes
}


function Navigator({ children }: PropsWithChildren) {
    const [path, setPath] = useState(navigationService.pathname);

    const navigateTo = useCallback((path: string) => {
        const newPath = path.startsWith("/") ? path :
            [navigationService.pathname, path].join("/");

        navigationService.navigateTo(new Event("path changed"), path);
        setPath(newPath);
    }, []);

    return <NavigationContext.Provider value={{
        navigateTo,
        path
    }}>
        {children}
    </NavigationContext.Provider>
}

export default function BrowserRouter({ routes }: BrowserRouterProps) {
    const [notFound, setNotFound] = useState<React.ReactElement>();

    const navigator = useNavigation();

    const setErrorPage = useCallback((e: React.ReactElement) => {
        setNotFound(e);
    }, []);

    const renderComponent = useCallback(() => {
        const currentRouteComponent = getComponentFromRoute(window.location.pathname);
        if (!currentRouteComponent) {
            return notFound || <></>;
        }
        return currentRouteComponent.component;
    }, [navigator]);

    useEffect(() => {
        service.configure(routes);
    }, [routes]);

    return (<Navigator>
        <RouterContext.Provider value={{
            setErrorPage,
            routes,
            renderComponent
        }}></RouterContext.Provider>
    </Navigator>);
}
