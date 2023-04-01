import React, { PropsWithChildren, MouseEvent } from "react"
import { useNavigation } from "../../hooks";

interface LinkProps extends PropsWithChildren {
    to: string;
}

export default function Link({ to, children }: LinkProps) {
    const navigator = useNavigation();
    return (<a href={to} onClick={(e) => navigator.navigateTo(e, to)}>
        {children}
    </a>)
}