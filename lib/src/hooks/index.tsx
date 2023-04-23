import { useContext } from "react"
import { NavigationContext, RouterContext } from "../contexts";

export const useRouter = (): RouterContext => {
    const context = useContext(RouterContext);
    return context;
}

export const useNavigation = (): NavigationContext => {
    const context = useContext(NavigationContext);
    return context;
}
