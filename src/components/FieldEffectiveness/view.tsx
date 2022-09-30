import React from 'react';
import { Trans } from "react-i18next";
import Plan from "../Tables/Plan/view";
import Indicators from "../Tables/Indicators/view";
import {IG, PG, SG, SP} from "../../consts";
import renderHeader from "./title";
class FieldEffectiveness extends React.Component<any, any> {
    state = {
        idea: this.props.effectiveness?.idea || null,
        indicators: this.props.effectiveness?.indicators || null,
        geography: this.props.effectiveness?.geography || null,
        calendarPlan: this.props.effectiveness?.calendarPlan || null,
        application: this.props.app_id ? { id: this.props.app_id} : null,
    }
    render () {
        const prog = this.props.program?.map((prog, idx) => {
            return prog.name
        });
        const { idea, indicators, geography } = this.state;
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
                                readOnly
                            />
                        </td>
                    </tr>}
                    <>
                        <Indicators indicators={this.state.indicators} program={this.props.program} />
                        <Plan plan={this.state.calendarPlan} program={this.props.program} />
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
                                readOnly
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
