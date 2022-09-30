import {PG} from "../../../consts";
import {Trans} from "react-i18next";
import React from "react";

const renderHeader = (prog) => {
    if (prog[0] === PG) {
        return <Trans>planPG</Trans>;
    }
    return <Trans>plan</Trans>;
}

export default renderHeader;