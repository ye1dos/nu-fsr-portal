import {toJS} from "mobx";
import {IG, PG, SE, SG, SI, SP} from "../consts";
import {Trans} from "react-i18next";
import React from "react";

const checkLimits = (sum, prog) => {
    console.log(sum);
    if (sum > 1000000 && prog[0] === SP) {
        return <p><Trans>limits.limitSP</Trans> (1 000 000)</p>
    }
    else if (sum > 5000000 && prog[0] === SE) {
        return <p><Trans>limits.limitSE</Trans> (5 000 000)</p>
    }
    else if (sum > 10000000 && prog[0] === SI) {
        return <p><Trans>limits.limitSI</Trans> (10 000 000)</p>
    }
    else if (sum > 5000000 && prog[0] === IG) {
        return <p><Trans>limits.limitIG</Trans> (5 000 000)</p>
    }
    else if (sum > 3000000 && prog[0] === SG) {
        return <p><Trans>limits.limitSG</Trans> (3 000 000)</p>
    }
    else if (sum > 1000000 && prog[0] === PG) {
        return <p><Trans>limits.limitPG</Trans> (1 000 000)</p>
    }
    return null;
}

export default checkLimits;