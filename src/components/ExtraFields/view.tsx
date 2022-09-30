import React from 'react';
import {IG, PG, SE, SG, SI, SP} from "../../consts";
import './style.css'
import FieldEfficiencyAndResult from "../FieldEfficiencyAndResult/view";
import FieldRelevance from "../FieldRelevance/view";
import FieldResource from "../FieldResource/view";
import FieldSustainability from "../FieldSustainability/view";
import FieldInnovativeness from "../FieldInnovativeness/view";
import FieldApplicationForm from "../FieldApplicationForm/view";
import TM from "../TM/view";
import FieldProjectIdea from "../FieldProjectIdea/view";
import BusinessModel from "../FieldBusinessModel/view";
import FieldEffectiveness from "../FieldEffectiveness/view";
import FieldOrganizationPotential from "../FieldOrganizationPotential/view";
import FieldScalability from "../FieldScalability/view";
import {Trans} from "react-i18next";

const ExtraFields = (props) => {
    const { program,
        teamMembers,
        relevance,
        resource,
        applicationForm,
        sustainability,
        innovativeness,
        efficiencyAndResult,
        projectIdea,
        businessModel,
        effectiveness,
        scalability,
        organizationPotential,
    } = props;
    const prog = program.map((prog) => {return prog.name});
    console.log(prog, "here")
    if (prog && prog[0] === SP) {
        return (
            <>
                <FieldApplicationForm applicationForm={applicationForm} />
                <FieldProjectIdea program={program} projectIdea={projectIdea} />
                <FieldEffectiveness program={program} effectiveness={effectiveness} />
                <h1 className={'extra-h1'}><Trans>RESOURCE</Trans></h1>
                <FieldResource program={program} resource={resource} />
                <TM program={SP} teamMembers={teamMembers} />
            </>
        )
    } else if (prog[0] === IG) {
        return (
            <>
                <FieldApplicationForm applicationForm={applicationForm} />
                <FieldOrganizationPotential program={program} organizationPotential={organizationPotential} />
                <FieldProjectIdea program={program} projectIdea={projectIdea} />
                <FieldScalability program={program} scalability={scalability} />
                <BusinessModel program={program} businessModel={businessModel} />
                <TM program={IG} teamMembers={teamMembers} />
                <FieldResource program={program} resource={resource} />
                <FieldInnovativeness program={program} innovativeness={innovativeness} />
            </>
        )
    }
    else if (prog[0] === SG) {
        // start
        return (
            <>
                <FieldApplicationForm applicationForm={applicationForm} />
                <FieldProjectIdea program={program} projectIdea={projectIdea} />
                <BusinessModel program={program} businessModel={businessModel} />
                <TM program={SG} teamMembers={teamMembers} />
                <FieldResource program={program} resource={resource} />
                <FieldInnovativeness program={program} innovativeness={innovativeness} />
            </>
        )
    }
    else if (prog[0] === PG) {
        // pilot
        return (
            <>
                <FieldApplicationForm applicationForm={applicationForm} />
                <FieldProjectIdea program={program} projectIdea={projectIdea} />
                <FieldEffectiveness program={program} effectiveness={effectiveness} />
                <h1 className={'extra-h1'}><Trans>RESOURCEPILOT</Trans></h1>
                <TM program={PG} teamMembers={teamMembers} />
                <FieldResource program={program} resource={resource} />
            </>
        )
    }
    else if (prog[0] === SI || prog[0] === SE) {
        return (
            <>
                <FieldApplicationForm applicationForm={applicationForm} />
                <FieldRelevance program={program} relevance={relevance} />
                <FieldEfficiencyAndResult program={program} efficiencyAndResult={efficiencyAndResult} />
                <FieldSustainability program={program} sustainability={sustainability} />
                <TM program={prog[0]} teamMembers={teamMembers} />
                <FieldResource program={program} resource={resource} />
                <FieldInnovativeness program={program} innovativeness={innovativeness} />
            </>
        )
    }
    return <></>;
}
export default ExtraFields;







