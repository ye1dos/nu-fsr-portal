import React from 'react';
import { Trans } from "react-i18next";
import DatePickerMultiComponent from "../../DatePickerMulti";
import {PG, SP} from "../../../consts";
import deleteIcon from "../../../assets/icons/delete-icon.svg";
import renderHeader from "./title";
class Plan extends React.Component<any, any> {
    state = {
        plan: this.props.plan || null,
    }
    renderPlan() {
        const prog = this.props.program?.map((prog, idx) => {
            return prog.name
        });
        const { plan } = this.state;
        return (
            <>
                {plan && plan.map((plan, idx) => (
                    <table className="application-table" key={idx}>
                        {prog && prog[0] !== PG &&
                            <tr>
                                <th className={'vertical_table_th'}>
                                    <Trans>event</Trans>
                                </th>
                                <td>
                                    <label>{plan.event}</label>
                                </td>
                            </tr>
                        }
                        <tr>
                            <th className={'vertical_table_th'}>
                                <Trans>deadline</Trans>
                            </th>
                            <td>
                                <label>{plan.deadline}</label>
                            </td>
                        </tr>
                        {prog && prog[0] !== SP && (
                            <tr>
                                <th className={'vertical_table_th'}>
                                    <Trans>descriptionEfficiency</Trans>
                                </th>
                                <td>
                                    <label>{plan.description}</label>
                                </td>
                            </tr>
                        )}
                    </table>
                ))}
            </>
        )
    }
    render () {
        const prog = this.props.program.map((prog) => {return prog.name});
        return (
            <>
                <p className='main-label' style={{marginBottom: '12px', marginTop: '24px'}}>{renderHeader(prog)}</p>
                <p style={{marginBottom: '12px'}} className={'extra-label'}><Trans>planExtra</Trans></p>
                <div className="application-table__body">
                    <div className="application-table">{this.renderPlan()}</div>
                </div>
            </>
        )
    }
}
export default Plan;
