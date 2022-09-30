import React from 'react';
import { Trans } from "react-i18next";
import Plan from "../Tables/Plan";
import Indicators from "../Tables/Indicators";
import {IG, PG, SE, SI, SP} from "../../consts";
import renderHeader from "./title";
import IndicatorsForPG from "../Tables/IndicatorsForPG";
class FieldEffectiveness extends React.Component<any, any> {
    state = {
        idea: this.props.effectiveness?.idea || null,
        indicators: this.props.effectiveness?.indicators || null,
        geography: this.props.effectiveness?.geography || null,
        calendarPlan: this.props.effectiveness?.calendarPlan || null,
        application: this.props.app_id ? { id: this.props.app_id} : null,
    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.state[name] = value;
        this.props.handleEffectivenessChange(this.state);
    }
    handlePlanChange = (plan) => {
        this.setState({calendarPlan: plan});
        this.props.handleEffectivenessChange(this.state);
    }
    handleIndicatorsChange = (ind) => {
        this.setState({indicators: ind});
        this.props.handleEffectivenessChange(this.state);
    }
    render () {
        const prog = this.props.program?.map((prog, idx) => {
            return prog.name
        });
        const { idea, geography } = this.state;
        return (
            <>
                <h1 className={'extra-h1'}>
                    {renderHeader(prog)}
                </h1>
                <table className="talap-form">
                    <tbody>
                    {prog && prog[0] !== SP &&
                        <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>effectiveness.idea</Trans></label>
                            <p className={'extra-label'}><Trans>effectiveness.ideaExtra</Trans></p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={idea}
                                name="idea"
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>}
                    <>
                        <IndicatorsForPG indicators={this.state.indicators} program={this.props.program} handleIndicatorsChange={this.handleIndicatorsChange} />
                        <Plan plan={this.state.calendarPlan}  program={this.props.program} handlePlanChange={this.handlePlanChange} />
                    </>
                    {prog && prog[0] !== SP &&
                        <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>geography</Trans></label>
                            <p className={'extra-label'}><Trans>geographyExtra</Trans></p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={geography}
                                name="geography"
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>}
                    </tbody>
                </table>
            </>
        )
    }
}
export default FieldEffectiveness;
