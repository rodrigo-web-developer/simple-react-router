import { PropsWithChildren, ReactNode, UIEvent, useCallback, useEffect, useState } from "react";
import { RouterContext, NavigationContext } from "../../contexts";
import { useNavigation, useRouter } from "../../hooks";
import navigationService from "../../services/NavigationService";
import service, { getComponentFromRoute, getParamsValues } from "../../services/PathMatchingService";
import { RouteMatcher, Routes, StringDictionary } from "../../types";

interface BrowserRouterProps extends PropsWithChildren {
    routes: Routes;
    notFoundPage?: React.FC | JSX.Element | ReactNode
}

function Navigator({ children }: PropsWithChildren) {
    const [path, setPath] = useState(navigationService.pathname);

    navigationService.onChangeRoute("DefaultNavigator", () => {
        console.log("PATH CHANGED: ", navigationService.pathname);
        setPath(navigationService.pathname);
    });

    const navigateTo = useCallback((event: UIEvent<Element>, relativePath: string) => {
        navigationService.navigateTo(event, relativePath);
    }, [path]);

    return <NavigationContext.Provider value={{
        navigateTo,
        path
    }}>
        {children}
    </NavigationContext.Provider>
}

export default function BrowserRouter({ routes, notFoundPage, children }: BrowserRouterProps) {
    return (<Navigator>
        <BrowserRouterWrapper routes={routes} notFoundPage={notFoundPage}>
            {children}
        </BrowserRouterWrapper>
    </Navigator>);
}

function BrowserRouterWrapper({ routes, notFoundPage, children }: BrowserRouterProps) {
    const [component, setComponent] = useState<React.ReactElement | JSX.Element | ReactNode | React.FC >();
    const [notFound, setNotFound] = useState<React.ReactElement>();
    const [currentRoute, setCurrentRoute] = useState<RouteMatcher>();
    const [pathParams, setPathParams] = useState<StringDictionary>({});

    const navigator = useNavigation();

    const renderComponent = useCallback(() => {
        const currentRouteComponent = getComponentFromRoute(window.location.pathname);

        if (!currentRouteComponent) {
            setPathParams({});
            return setComponent(notFound || <></>);
        }
        const params = getParamsValues(currentRouteComponent);
        setCurrentRoute(currentRouteComponent);
        setPathParams(params);
        return setComponent(currentRouteComponent.component);
    }, []);

    useEffect(() => {
        service.configure(routes);
    }, [routes]);

    useEffect(() => {
        renderComponent();
    }, [navigator.path]);

    return (<RouterContext.Provider value={{
        routes,
        component,
        pathParams
    }}>
        {children}
    </RouterContext.Provider>);
}


export function RenderComponent(props: PropsWithChildren) {
    const { component } = useRouter();
    return <>{component}</>;
}