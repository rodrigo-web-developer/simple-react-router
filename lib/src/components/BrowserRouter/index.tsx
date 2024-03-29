import { PropsWithChildren, ReactNode, UIEvent, useCallback, useEffect, useState } from "react";
import { RouterContext, NavigationContext } from "../../contexts";
import { useNavigation, useRouter } from "../../hooks";
import navigationService from "../../services/NavigationService";
import service, { getComponentFromRoute, getParamsValues, getPathWithParams } from "../../services/PathMatchingService";
import { RouteMatcher, Routes, StringDictionary } from "../../types";

interface BrowserRouterProps extends PropsWithChildren {
    routes: Routes;
    notFoundPage?: React.FC | JSX.Element | ReactNode
}

function Navigator({ children }: PropsWithChildren) {
    const [path, setPath] = useState(navigationService.pathname);

    navigationService.onChangeRoute("DefaultNavigator", () => {
        setPath(navigationService.pathname);
    });

    const navigateTo = useCallback((event: UIEvent<Element> | null, relativePath: string, state: any = null) => {
        navigationService.navigateTo(event, relativePath, state);
    }, [path]);

    const navigateToRoute = useCallback((e: React.UIEvent<Element> | null, routeName: string, routeParams?: StringDictionary, state: any = null) => {
        navigationService.navigateToRoute(e, routeName, routeParams, state);
    }, [path]);

    return <NavigationContext.Provider value={{
        navigateTo,
        navigateToRoute,
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
    const [component, setComponent] = useState<React.ReactElement | JSX.Element | ReactNode | React.FC>();
    const [currentRoute, setCurrentRoute] = useState<RouteMatcher>();
    const [pathParams, setPathParams] = useState<StringDictionary>({});
    const [configured, setConfigured] = useState<boolean>();

    const navigator = useNavigation();

    const renderComponent = useCallback(() => {
        const currentRouteComponent = getComponentFromRoute(window.location.pathname);

        if (!currentRouteComponent) {
            setPathParams({});
            return setComponent(notFoundPage || <></>);
        }
        const params = getParamsValues(currentRouteComponent);
        setCurrentRoute(currentRouteComponent);
        setPathParams(params);
        return setComponent(currentRouteComponent.component);
    }, []);

    useEffect(() => {
        service.configure(routes);
        setConfigured(true);
    }, [routes]);

    useEffect(() => {
        renderComponent();
    }, [navigator.path]);

    return (<RouterContext.Provider value={{
        routes,
        component,
        pathParams
    }}>
        {configured && children}
    </RouterContext.Provider>);
}


export function RenderComponent(props: PropsWithChildren) {
    const { component } = useRouter();
    return <>{component}</>;
}