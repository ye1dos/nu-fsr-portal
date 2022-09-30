import React from 'react';
import FieldEfficiencyAndResult from "../FieldEfficiencyAndResult";
import FieldRelevance from "../FieldRelevance";
import FieldResource from "../FieldResource";
import FieldSustainability from "../FieldSustainability";
import FieldInnovativeness from "../FieldInnovativeness";
import FieldApplicationForm from "../FieldApplicationForm";
import './style.css'
import TM from "../TM";
import {IG, PG, SE, SG, SI, SP} from "../../consts";
import FieldProjectIdea from "../FieldProjectIdea";
import BusinessModel from "../FieldBusinessModel";
import FieldEffectiveness from "../FieldEffectiveness";
import FieldScalability from "../FieldScalability";
import FieldOrganizationPotential from "../FieldOrganizationPotential";
import {Trans} from "react-i18next";

const ExtraFields = (props) => {
    const { program,
        businessModel,
        projectIdea,
        teamMembers,
        relevance,
        app_id,
        resource,
        applicationForm,
        sustainability,
        innovativeness,
        efficiencyAndResult,
        effectiveness,
        scalability,
        organizationPotential,
        handleApplicationFormChange,
        handleResourceChange,
        handleRelevanceChange,
        handleEfficiencyAndResultChange,
        handleSustainabilityChange,
        handleInnovativenessChange,
        handleTMChange,
        handleProjectIdeaChange,
        handleBusinessModelChange,
        handleEffectivenessChange,
        handleScalabilityChange,
        handleOrganizationPotentialChange,
    } = props;
    const prog = program.map((prog) => {return prog.name});
    if (prog) {
        if (prog[0] === SP) {
            return (
                <>
                    <FieldApplicationForm app_id={app_id} applicationForm={applicationForm} handleApplicationFormChange={handleApplicationFormChange} />
                    <FieldProjectIdea app_id={app_id} program={program} projectIdea={projectIdea} handleProjectIdeaChange={handleProjectIdeaChange} />
                    {/* <FieldEffectiveness app_id={app_id} program={program} effectiveness={effectiveness} handleEffectivenessChange={handleEffectivenessChange} /> */}
                    <h1 className={'extra-h1'}><Trans>RESOURCE</Trans></h1>
                    <FieldResource app_id={app_id} program={program} resource={resource} handleResourceChange={handleResourceChange} />
                    <TM program={SP} teamMembers={teamMembers} handleTMChange={handleTMChange} />
                </>
            )
        }
        else if (prog[0] === IG) {
            // orgId пока не робит
            return (
                <>
                    <FieldApplicationForm app_id={app_id} applicationForm={applicationForm} handleApplicationFormChange={handleApplicationFormChange} />
                    <FieldOrganizationPotential app_id={app_id} program={program} organizationPotential={organizationPotential} handleOrganizationPotentialChange={handleOrganizationPotentialChange} />
                    <FieldProjectIdea app_id={app_id} program={program} projectIdea={projectIdea} handleProjectIdeaChange={handleProjectIdeaChange}  />
                    <FieldScalability app_id={app_id} program={program} scalability={scalability} handleScalabilityChange={handleScalabilityChange} />
                    <BusinessModel app_id={app_id} program={program} businessModel={businessModel} handleBusinessModelChange={handleBusinessModelChange} />
                    <TM teamMembers={teamMembers} handleTMChange={handleTMChange} />
                    <FieldResource app_id={app_id} program={program} resource={resource} handleResourceChange={handleResourceChange} />
                    <FieldInnovativeness app_id={app_id} program={program} innovativeness={innovativeness} handleInnovativenessChange={handleInnovativenessChange} />
                </>
            )
        }
        else if (prog[0] === SG) {
            // start
            return (
                <>
                    <FieldApplicationForm app_id={app_id} applicationForm={applicationForm} handleApplicationFormChange={handleApplicationFormChange} />
                    <FieldProjectIdea app_id={app_id} program={program} projectIdea={projectIdea} handleProjectIdeaChange={handleProjectIdeaChange}  />
                    <BusinessModel app_id={app_id} program={program} businessModel={businessModel} handleBusinessModelChange={handleBusinessModelChange} />
                    <TM teamMembers={teamMembers} handleTMChange={handleTMChange}/>
                    <FieldResource app_id={app_id} program={program} resource={resource} handleResourceChange={handleResourceChange} />
                    <FieldInnovativeness app_id={app_id} program={program} innovativeness={innovativeness} handleInnovativenessChange={handleInnovativenessChange} />
                </>
            )
        }
        else if (prog[0] === PG) {
            // pilot
            return (
                <>
                    <FieldApplicationForm app_id={app_id} applicationForm={applicationForm} handleApplicationFormChange={handleApplicationFormChange} />
                    <FieldProjectIdea app_id={app_id} program={program} projectIdea={projectIdea} handleProjectIdeaChange={handleProjectIdeaChange} />
                    <FieldEffectiveness app_id={app_id} program={program} effectiveness={effectiveness} handleEffectivenessChange={handleEffectivenessChange} />
                    {/*<BusinessModel app_id={app_id} program={program} businessModel={businessModel} handleBusinessModelChange={handleBusinessModelChange} />*/}
                    <h1 className={'extra-h1'}><Trans>RESOURCEPILOT</Trans></h1>
                    <FieldResource app_id={app_id} program={program} resource={resource} handleResourceChange={handleResourceChange} />
                    <TM program={prog[0]} teamMembers={teamMembers} handleTMChange={handleTMChange} />
                </>
            )
        }
        else if (prog[0] === SI || prog[0] === SE) {
            return (
                <>
                    <FieldApplicationForm app_id={app_id} applicationForm={applicationForm} handleApplicationFormChange={handleApplicationFormChange} />
                    <FieldRelevance app_id={app_id} program={program} relevance={relevance} handleRelevanceChange={handleRelevanceChange}/>
                    <FieldEfficiencyAndResult app_id={app_id} program={program} efficiencyAndResult={efficiencyAndResult} handleEfficiencyAndResultChange={handleEfficiencyAndResultChange}/>
                    <FieldSustainability app_id={app_id} program={program} sustainability={sustainability} handleSustainabilityChange={handleSustainabilityChange} />
                    <TM teamMembers={teamMembers} handleTMChange={handleTMChange}/>
                    <FieldResource app_id={app_id} program={program} resource={resource} handleResourceChange={handleResourceChange} />
                    <FieldInnovativeness app_id={app_id} program={program} innovativeness={innovativeness} handleInnovativenessChange={handleInnovativenessChange}/>
                </>
            )
        }
    }
    return <></>;
}
export default ExtraFields;
