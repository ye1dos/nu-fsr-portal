import React from 'react';
import { Trans } from "react-i18next";
import {IG, PG, SG, SP} from "../../consts";
import Plan from "../Tables/Plan/view";
import Indicators from "../Tables/Indicators/view";
import renderHeader from "./title";
class FieldProjectIdea extends React.Component<any, any> {
    state = {
        beneficiaries: this.props.projectIdea?.beneficiaries || null,
        socialProblem: this.props.projectIdea?.socialProblem || null,
        problemSolving: this.props.projectIdea?.socialProblem || null,
        viability: this.props.projectIdea?.viability || null,
        motivationalQuestion: this.props.projectIdea?.motivationalQuestion || null,
        geography: this.props.projectIdea?.geography || null,
        application: this.props.app_id ? { id: this.props.app_id} : null,
        calendarPlan:  this.props.projectIdea?.calendarPlan || null,
        indicators:  this.props.projectIdea?.indicators || null,
        projectPartners:  this.props.projectIdea?.projectPartners || null,
        marketingChannels:  this.props.projectIdea?.marketingChannels || null,
        customers:  this.props.projectIdea?.customers || null,
    }
    renderIGprogram = (motivationalQuestion, geography) => {
        return (
            <>
                <tr className={'extra-tr'}>
                    <th>
                        <label className={'main-label'} htmlFor=""><Trans>couse</Trans></label>
                        <p className={'extra-label'}><Trans>couseExtra</Trans></p>
                    </th>
                    <td>
                      <textarea
                          className="table__text"
                          defaultValue={motivationalQuestion}
                          name="motivationalQuestion"
                          readOnly
                      />
                    </td>
                </tr>
                <tr className={'extra-tr'}>
                    <th>
                        <label className={'main-label'} htmlFor=""><Trans>territory</Trans></label>
                        <p className={'extra-label'}><Trans>territoryExtra</Trans></p>
                    </th>
                    <td>
                      <textarea
                          className="table__text"
                          defaultValue={geography}
                          name="geography"
                          readOnly
                      />
                    </td>
                </tr>
            </>
        )
    }
    render () {
        const prog = this.props.program?.map((prog, idx) => {
            return prog.name
        });
        const { marketingChannels, customers, projectPartners, motivationalQuestion, problemSolving, viability, beneficiaries, socialProblem, geography } = this.state;
        return (
            <>
                <h1 className={'extra-h1'}>
                    {renderHeader(prog)}
                </h1>
                <table style={{paddingTop: "20px"}} className="talap-form">
                    <tbody>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>socialProblem</Trans></label>
                            <p className={'extra-label'}><Trans>socialProblemExtra</Trans></p>
                        </th>
                        <td>
                      <textarea
                          className="table__text"
                          defaultValue={socialProblem}
                          name="socialProblem"
                          readOnly
                      />
                        </td>
                    </tr>
                    {prog && prog[0] !== SP && prog[0] !== IG &&
                        <tr className={'extra-tr'}>
                            <th>
                                <label className={'main-label'} htmlFor=""><Trans>couse</Trans></label>
                                <p className={'extra-label'}><Trans>couseExtra</Trans></p>
                            </th>
                            <td>
                      <textarea
                          className="table__text"
                          defaultValue={motivationalQuestion}
                          name="motivationalQuestion"
                          readOnly
                      />
                            </td>
                        </tr>
                    }
                    {prog && prog[0] !== IG && <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>projectIdea.problemSolving</Trans></label>
                            <p className={'extra-label'}><Trans>projectIdea.problemSolvingExtra</Trans></p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={problemSolving}
                                name="problemSolving"
                                readOnly
                            />
                        </td>
                    </tr>}
                    {prog && prog[0] === SG && (<>
                        <tr className={'extra-tr'}>
                            <th>
                                <label className={'main-label'} htmlFor=""><Trans>projectIdea.results</Trans></label>
                                <p className={'extra-label'}>
                                    <Trans>projectIdea.resultsExtra</Trans>
                                </p>
                            </th>
                            <td>
                      <textarea
                          className="table__text"
                          defaultValue={viability}
                          name="viability"
                          readOnly
                      />
                            </td>
                        </tr>
                    </>)}
                    {/* */}
                    {prog && (prog[0] === SG || prog[0] === SP) && <>
                        <tr className={'extra-tr'}>
                            <th>
                                <label className={'main-label'} htmlFor=""><Trans>territory</Trans></label>
                                <p className={'extra-label'}><Trans>territoryExtra</Trans></p>
                            </th>
                            <td>
                      <textarea
                          className="table__text"
                          defaultValue={geography}
                          name="geography"
                          readOnly
                      />
                            </td>
                        </tr></>}
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>beneficiaty</Trans></label>
                            <p className={'extra-label'}><Trans>beneficiatyExtra</Trans></p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={beneficiaries}
                                name="beneficiaries"
                                readOnly
                            />
                        </td>
                    </tr>
                    {/*  IG */}
                    {prog && prog[0] === IG && this.renderIGprogram(motivationalQuestion, geography)}
                    {prog && prog[0] !== SP && prog[0] !== IG &&
                        <>
                            {prog && prog[0] !== SG &&
                                <tr className={'extra-tr'}>
                                    <th>
                                        <label className={'main-label'}
                                               htmlFor=""><Trans>projectIdea.customers</Trans></label>
                                        <p className={'extra-label'}><Trans>projectIdea.customersExtra</Trans></p>
                                    </th>
                                    <td>
                                    <textarea
                                        className="table__text"
                                        defaultValue={customers}
                                        name="customers"
                                        readOnly
                                    />
                                    </td>
                                </tr>
                            }
                            {prog && prog[0] !== SG  && <><tr className={'extra-tr'}>
                                <th>
                                    <label className={'main-label'}
                                           htmlFor=""><Trans>projectIdea.marketingChannels</Trans></label>
                                    <p className={'extra-label'}><Trans>projectIdea.marketingChannelsExtra</Trans></p>
                                </th>
                                <td>
                            <textarea
                                className="table__text"
                                defaultValue={marketingChannels}
                                name="marketingChannels"
                                readOnly
                            />
                                </td>
                            </tr>
                                <tr className={'extra-tr'}>
                                    <th>
                                        <label className={'main-label'} htmlFor=""><Trans>projectIdea.projectPartners</Trans></label>
                                        <p className={'extra-label'}><Trans>projectIdea.projectPartnersExtra</Trans></p>
                                    </th>
                                    <td>
                                <textarea
                                    className="table__text"
                                    defaultValue={projectPartners}
                                    name="projectPartners"
                                    readOnly
                                />
                                    </td>
                                </tr></>}
                        </>
                    }
                    {prog && prog[0] === SP && <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>couse</Trans></label>
                            <p className={'extra-label'}><Trans>couseExtra</Trans></p>
                        </th>
                        <td>
                      <textarea
                          className="table__text"
                          defaultValue={motivationalQuestion}
                          name="motivationalQuestion"
                          readOnly
                      />
                        </td>
                    </tr>}
                    {prog && prog[0] !== PG && prog[0] !== SP && prog[0] !== IG && (
                        <>
                            <Indicators indicators={this.state.indicators} program={this.props.program}/>
                            {prog[0] !== IG && <Plan plan={this.state.calendarPlan}  program={this.props.program}/>}
                        </>)}
                    </tbody>
                </table>
            </>
        )
    }
}
export default FieldProjectIdea;