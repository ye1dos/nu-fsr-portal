import React from 'react';
import { Trans } from "react-i18next";
import deleteIcon from "../../../assets/icons/delete-icon.svg";
import {SG} from "../../../consts";
import renderHeader from "./title";
class Indicators extends React.Component<any, any> {
    state = {
        indicators: this.props.indicators || null,
    }
    renderIndicators = () => {
        const { indicators } = this.state;
        return (
            <>
                <table className="application-table">
                {indicators && indicators.map((ind, idx) => (
                    <>
                        <tr>
                            <th className={'vertical_table_th'}>
                                <Trans>indicatorsObj.nameInd</Trans>
                            </th>
                            <td>
                                <label>{ind.name}</label>
                            </td>
                        </tr>
                        <tr>
                            <th className={'vertical_table_th'}>
                                <Trans>indicatorsObj.unit</Trans>
                            </th>
                            <td>
                                <label>{ind.unit}</label>
                            </td>
                        </tr>
                        <tr>
                            <th className={'vertical_table_th'}>
                                <Trans>indicatorsObj.ultimateGoal</Trans>
                            </th>
                            <td>
                                <label>{ind.ultimateGoal}</label>
                            </td>
                        </tr>
                    </>
                ))}
                </table>
            </>
        )
    }
    render () {
        const prog = this.props.program.map((prog) => {return prog.name});
        return (
            <>
                <p className='main-label' style={{marginBottom: '12px', marginTop: '24px'}}>{renderHeader(prog)}</p>
                <p style={{marginBottom: '12px'}} className={'extra-label'}><Trans>indicatorsOfSuccessExtra</Trans></p>
                <div className="application-table__body">
                    <div className="application-table">{this.renderIndicators()}</div>
                </div>
            </>
        )
    }
}
export default Indicators;
