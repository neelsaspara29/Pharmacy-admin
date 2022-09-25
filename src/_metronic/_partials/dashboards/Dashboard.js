import React, {useMemo} from "react";
import objectPath from "object-path";
import {useHtmlClassService} from "../../layout";
import {Demo1Dashboard} from "./Demo1Dashboard";


export function Dashboard() {
    const uiService = useHtmlClassService();
    const layoutProps = useMemo(() => {
        return {
            demo: objectPath.get(
                uiService.config,
                "demo"
            )};
    }, [uiService]);
    return <>
        <Demo1Dashboard />
    </>;
}
