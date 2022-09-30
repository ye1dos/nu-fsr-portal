import {IG} from "../../../consts";
import {Trans} from "react-i18next";
import React from "react";

const renderHeader = (prog) => {
    if (prog[0] === IG) {
        return <Trans>businessModel.FMBaseIG</Trans>;
    }
    return <Trans>businessModel.FMBase</Trans>;
}

export default renderHeader;