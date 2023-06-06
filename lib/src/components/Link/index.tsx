import React, { PropsWithChildren } from "react"
import { useNavigation } from "../../hooks";

interface LinkToProps extends PropsWithChildren {
    to: string;
}

interface LinkRouteProps extends PropsWithChildren {
    toRoute: string;
}

type LinkProps = LinkToProps;// | LinkRouteProps;

export default function Link(params: LinkProps) {
    const navigator = useNavigation();
    return (<a href={params.to} onClick={(e) => navigator.navigateTo(e, params.to)}>
        {params.children}
    </a>)
}
