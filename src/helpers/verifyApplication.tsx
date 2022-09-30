import {toast} from "react-toastify";
import i18next from "i18next";
import { toJS } from "mobx";
import {IG, PG, SE, SG, SI, SP} from "../consts";
import wrongText from "./wrongText";
import {Trans} from "react-i18next";
import React from "react";

const verifyApplication = (state, applicant): boolean => {
    console.log(localStorage.getItem("appId"))
    console.log(state);
    const indicators = checkIndicators(state.programs, state.projectIdea?.indicators, state.effectiveness?.indicators);
    if (indicators === false) {
        return false;
    }
    // Resource
    let resource = checkExtraResource(state.programs, state.resource);
    if (resource === false) {
        return false;
    }
    // teamMembers
    const tmVerified = state.teamMembers && checkTM(state.teamMembers, applicant);
    if (tmVerified === false) {
        return false;
    }
    // programs
    if (!state.programs.length) {
        wrongText("AddPrograms");
        return false;
    }
    // applicationForm
    let applicationForm = checkapplicationForm(state.applicationForm);
    if (applicationForm === false) {
        return false;
    }
    if (state.programs[0].name === SI || state.programs[0].name === SE) {

        // Relevance
        let relevance = checkRelevance(state.relevance);
        if (relevance === false) {
            return false;
        }
        // EfficiencyAndResult
        let eff = checkEfficiencyAndResult(state.efficiencyAndResult);
        if (eff === false) {
            return false;
        }
        // Resource
        let resource = checkExtraResource(state.programs, state.resource);
        if (resource === false) {
            return false;
        }
    }
    // only SP
    if (state.programs[0].name === SI || state.programs[0].name === SE) {
        // Sustainability
        let sus = checkSustainability(state.sustainability);
        if (sus === false) {
            return false;
        }
        // Innovativeness
        let inn = checkInnovativeness(state.innovativeness);
        if (inn === false) {
            return false;
        }
    }
    return true;
};
// done
const checkInnovativeness = (inn) => {
    if (inn === null || !Object.keys(inn).length) {
        wrongText("EditInn");
        return false;
    }
    else if (!inn.innovation ) {
        wrongText("EditInnI");
        return false;
    }
    else if (!inn.competitors ) {
        wrongText("EditInnC");
        return false;
    }
    // else if (!inn.advantages) {
    //     wrongText("EditInnA");
    //     return false;
    // }
    return true;
}
 // done
const checkSustainability = (sus) => {
    if (sus === null || !Object.keys(sus).length) {
        wrongText("EditSustainability");
        return false;
    }
    else if (!sus.customer) {
        wrongText("EditSustainabilityCustomer");
        return false;
    }
    else if (!sus.scaling) {
        wrongText("EditSustainabilityScaling");
        return false;
    }
    else if (
        sus.financialModel && (
        !sus.financialModel.expenditure ||
        !sus.financialModel.costAndVolume ||
        !sus.financialModel.incomeSource ||
        !sus.financialModel.incomeDistribution
    )) {
        wrongText("EditSustainabilityfinancialModel");
        return false;
    }
    return true;
}
// done
const checkEfficiencyAndResult = (eff) => {
    if (eff === null || !Object.keys(eff).length) {
        wrongText("EditEfficiency");
        return false;
    }
    else if (!eff.projectCoverage) {
        wrongText("EditEfficiencyPC");
        return false;
    }
    else if (!eff.indicatorsOfSuccess) {
        wrongText("EditEfficiencyIoS");
        return false;
    }
    else if (!eff.socialContribution
    ) {
        wrongText("EditEfficiencySC");
        return false;
    }
    else if (!eff.goalAndTask) {
        wrongText("EditEfficiencyGaT");
        return false;
    }
    else if (!eff.plan || !eff.plan.length) {
        wrongText("EditEfficiencyPlan");
        return false;
    }
    if (eff.plan) {
        // const regex = new RegExp("([0-2]{1}[0-9]{1}|3[0-1]{1})[.](0[1-9]|1[0-2])[.][0-9]{4}");
        for (let plan of eff.plan ) {
            if (!plan.event || !plan.description || !plan.deadline) {
                wrongText("EditEfficiencyPlan");
                return false;
            }
            let deadline = plan.deadline.split('-');
            if (deadline[0] === 'null' || deadline[1] === 'null') {
                wrongText("EditEfficiencyPlan");
                return false;
            }
            // const date = plan.deadline.split('-');
            // const from = date[0];
            // const to = date[1];
            // const fromArray = from.split('.');
            // const toArray = to.split('.');
            // if (!regex.test(from) || !regex.test(to)) {
            //     toast.error("Формат Даты не верный, попробуйте в формате DD.MM.YYYY-DD.MM.YYYY", {
            //         position: toast.POSITION.BOTTOM_CENTER,
            //     });
            //     return false;
            // }
            // else if (parseInt(fromArray[2]) > parseInt(toArray[2]) || (parseInt(fromArray[2]) <= parseInt(toArray[2]) && (parseInt(fromArray[1]) > parseInt(toArray[1]) || (parseInt(fromArray[1]) <= parseInt(toArray[1]) && parseInt(fromArray[0]) > parseInt(toArray[0]))))) {
            //     toast.error("Дата неверна", {
            //         position: toast.POSITION.BOTTOM_CENTER,
            //     });
            //     return false;
            // }
        }
    }
    return true;
}
// done
const checkRelevance = (rel) => {
    if (rel === null || !Object.keys(rel).length) {
        wrongText("EditRelevance");
        return false;
    }
    // else if (!rel.beneficiaty) {
    //     wrongText("EditRelevanceB");
    //     return false;
    // }
    else if (!rel.socialProblem) {
        wrongText("EditRelevanceSP");
        return false;
    }
    // else if (!rel.territory) {
    //     wrongText("EditRelevanceT");
    //     return false;
    // }
    else if (!rel.couse) {
        wrongText("EditRelevanceCouse");
        return false;
    }
    return true;
}
const checkInd = (ind) => {
    if (ind && ind.length) {
        for (let i = 0; i < ind.length; i++) {
            if (ind[i].unit == '' || ind[i].name === '' || ind[i].ultimateGoal === '') {
                wrongText("EditEfficiencyIoS");
                return false;
            }
        }
    }
    else {
        wrongText("EditEfficiencyIoS");
        return false;
    }
}
const checkIndicators = (prog, SPind, IGind) => {
    let ind = null;
    if (prog[0].name === SP || prog[0].name === IG || prog[0].name === SG) {
        ind = SPind;
        let ch = checkInd(ind);
        if (ch === false) return false;
    }
    else if (prog[0].name === PG) {
        ind = IGind;
        let ch = checkInd(ind);
        if (ch === false) return false;
    }
}
// done
const checkExtraResource = (prog, resource) => {
    if (resource === null || !Object.keys(resource).length) {
        console.log('0')
        wrongText("EditResource");
        return false;
    }
    else if (!resource.budget || !resource.budget.length) {
        console.log('1')
        wrongText("EditResourceBudget");
        return false;
    }
    else if (prog[0].name === SI || prog[0] === SE) {
        if (!resource.partners) {

            console.log('1.1')
            wrongText("EditResourceP");
            return false;
        }
        else if (!resource.results) {
            console.log('1.1')
            wrongText("EditResourceR");
            return false;
        }
    }
    else if (prog[0].name === SI) {
        if (!resource.marketTest) {
            wrongText("EditResourceMT");
            return false;
        }
        else if ( !resource.income) {
            wrongText("EditResourceI");
            return false;
        }
        else if (!resource.funds) {
            wrongText("EditResourceF");
            return false;
        }
        else if (!resource.description) {
            wrongText("EditResourceD");
            return false;
        }
    }
    else if (prog[0].name === SE && !resource.experience) {
        console.log('3')
        wrongText("EditResourceExp");
        return false;
    }
    else if (resource.budget) {
        let sumAll = 0;
        let grantSum = 'Средства гранта Фонда';
        for (let budget of resource.budget) {
            if (!budget.expenditureItem || !budget.amount ||
                !budget.quantity || !budget.source
                // || !budget.price
            ) {
                wrongText("EditResourceBudget");
                return false;
            }
            if (budget.source === grantSum) {
                if (typeof budget.price === 'number') {
                    sumAll += budget.price;
                }
                else if (budget.price) {
                    sumAll += (budget.price).replace(/^\s+|\s+|\s$/g, '') - 0;
                }
            }
        }
        if (sumAll > 10000000 && prog[0].name == SI) {
            wrongText("limits.limitSI");
            return false;
        }
        if (sumAll > 5000000 && prog[0].name == SE) {
            wrongText("limits.limitSE");
            return false;
        }
        if (sumAll > 1000000 && prog[0].name == SP) {
            wrongText("limits.limitSP");
            return false;
        }
        if (sumAll > 5000000 && prog[0].name === IG) {
            wrongText("limits.limitIG");
            return false;
        }
        if (sumAll > 3000000 && prog[0].name === SG) {
            wrongText("limits.limitSG");
            return false;
        }
        if (sumAll > 1000000 && prog[0].name === PG) {
            wrongText("limits.limitPG");
            return false;
        }

        if (!resource.materialBase || !resource.materialBase.length) {
            console.log("not o r yes")
            wrongText("EditResourceMB");
            return false;
        }
        else if (resource.materialBase.length > 0) {
            for (let mb of resource.materialBase) {
                if (!mb.purpose || !mb.name) {
                    console.log('5')
                    wrongText("EditResourceMB");
                    return false;
                }
            }
        }
    }
    return true;
}
// done
const checkapplicationForm = (applicationForm) => {
    if (applicationForm === null || !Object.keys(applicationForm).length) {
        wrongText("EditApplicationForm");
        return false;
    }
    else if (
        !applicationForm.projectName
    ) {
        wrongText("EditApplicationFormPN");
        return false;
    }
    else if (
        !applicationForm.applicantKind
    ) {
        wrongText("EditApplicationFormAK");
        return false;
    }
    else if (
        !applicationForm.projectDuration
    ) {
        wrongText("EditApplicationFormPD");
        return false;
    }
    else if (applicationForm.projectDuration) {
        let projectDuration = applicationForm.projectDuration.split('-');
        if (projectDuration[0] === 'null' || projectDuration[1] === 'null') {
            wrongText("EditApplicationFormPD");
            return false;
        }
    }
    else if (applicationForm.applicantKind === "ORGANIZATION") {
        if (!applicationForm.organizationName) {
            wrongText("EditApplicationFormON");
            return false;
        }
        else if (!applicationForm.activityDirection) {
            wrongText("EditApplicationFormAD");
            return false;
        }
    }
    return true;
}
const checkTM = (tm, applicant) => {
    for (let i = 0; i < tm.length; i++) {
        if (tm[i].email === applicant.email || tm[i].iin === applicant.iin) {
            wrongText("LeaderCanNotBeMember");
            return false;
        } else if (
            tm[i].email === "" &&
            (tm[i].iin === "" || tm[i].iin === null)
        ) {
            wrongText("TeamMemberEmailandIINisEmpty");
            return false;
        } else if (tm[i].email === "") {
            wrongText("TeamMemberEmailisEmpty");
            return false;
        } else if (tm[i].iin === "" || tm[i].iin === null) {
            wrongText("TeamMemberIINisEmpty");
            return false;
        }
    }
}
export default verifyApplication;
