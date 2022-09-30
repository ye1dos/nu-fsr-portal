import {SG} from "../../../consts";
import {Trans} from "react-i18next";
import React from "react";

const renderHeader = (prog) => {
    if (prog[0] === SG) {
        return <Trans>indicatorsOfSuccess2</Trans>
    }
    else if (prog[0] === SG) {
        return  <Trans>Индикаторы проекта</Trans>
    }
    else {
        return <Trans>indicatorsOfSuccess</Trans>
    }
}

export default renderHeader;