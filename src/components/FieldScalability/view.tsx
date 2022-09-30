import React from 'react';
import { Trans } from "react-i18next";
import Indicators from "../Tables/Indicators/view";
import Plan from "../Tables/Plan/view";
import {IG} from "../../consts";
class FieldScalability extends React.Component<any, any> {
    state = {
        idea: this.props.scalability?.idea || null,
        goal: this.props.scalability?.goal || null,
        application: this.props.app_id ? { id: this.props.app_id } : null,
        indicators: this.props.scalability?.indicators || null,
        calendarPlan: this.props.scalability?.calendarPlan || null,
    }
    render () {
        const { goal, idea } = this.state;
        const prog = this.props.program.map((el) => el.name);
        return (
            <>
                <h1 className={'extra-h1'}>
                    <Trans>scalability.scalability</Trans>
                </h1>
                <table className="talap-form">
                    <tbody>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>scalability.idea</Trans></label>
                            <p className={'extra-label'}><Trans>scalability.ideaExtra</Trans></p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={idea}
                                name="idea"
                                readOnly
                            />
                        </td>
                    </tr>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>scalability.goal</Trans></label>
                            <p className={'extra-label'}>
                                <Trans>scalability.goalExtra</Trans>
                            </p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={goal}
                                name="goal"
                                readOnly
                            />
                        </td>
                    </tr>
                    <>
                        <Indicators indicators={this.state.indicators} program={this.props.program} />
                        <Plan plan={this.state.calendarPlan} program={this.props.program} />
                    </>
                    </tbody>
                </table>
            </>
        )
    }
}
export default FieldScalability;
