import {IG} from "../../consts";
import {Trans} from "react-i18next";
import React from "react";

const renderTitle = (prog) => {
    if (prog && prog[0] === IG ) {
        return <Trans>BMforIG</Trans>;
    }
    else {
        return <Trans>BM</Trans>;
    }
}
export default renderTitle;