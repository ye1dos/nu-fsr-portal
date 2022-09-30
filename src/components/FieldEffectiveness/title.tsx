import {IG, PG, SE, SI, SP} from "../../consts";
import {Trans} from "react-i18next";
import React from "react";

const renderHeader = (prog) => {
    if (prog[0] === PG || prog[0] === IG) {
        return <Trans>EFF</Trans>;
    }
    else if (prog[0] === SP || prog[0] === SI || prog[0] === SE) {
        return <Trans>EFFECTIVNOST</Trans>;
    }
    else {
        return <Trans>ACTUALNOST</Trans>;
    }
}
export default renderHeader;