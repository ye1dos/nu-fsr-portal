import {PG, SP} from "../../consts";
import {Trans} from "react-i18next";
import React from "react";

const renderHeader = (prog) => {
    if (prog[0] === SP || prog[0] === PG) {
        return (<>
                <Trans>PROJECTIDEA</Trans>
                <br/>
                <p><Trans>projectIdea.projectIdeaExtra</Trans></p>
            </>);
    }
    else {
        return <Trans>ACTUALNOST</Trans>;
    }
}
export default renderHeader;