import React from "react"
import { useNavigation } from "../../hooks";

interface LinkToProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string;
}

type LinkProps = Omit<Omit<LinkToProps, "href">, "onClick">;// | LinkRouteProps;

export default function Link({ to, children, ...rest }: LinkProps) {
    const navigator = useNavigation();
    return (<a {...rest}
        href={to} onClick={(e) => navigator.navigateTo(e, to)}>
        {children}
    </a>)
}
