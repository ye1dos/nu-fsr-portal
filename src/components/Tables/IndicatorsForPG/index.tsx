import React from 'react';
import { Trans } from "react-i18next";
import deleteIcon from "../../../assets/icons/delete-icon.svg";
import {PG, SG} from "../../../consts";
import renderHeader from "./title";
import i18next from "i18next";
class Indicators extends React.Component<any, any> {
    state = {
        indicators: this.props.indicators || [
            {
                unit: 'unit',
                name: 'nameIndicators',
                ultimateGoal: '3',
            },
            {
                unit: '',
                name: '',
                ultimateGoal: '',
            },
            {
                unit: '',
                name: '',
                ultimateGoal: '',
            },
            {
                unit: '',
                name: '',
                ultimateGoal: '',
            },
        ],
    }
    handleInputChangeIndicators = (event, index) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        const indicators = this.state.indicators;
        let form = indicators[index];
        if (name === 'ultimateGoal') {
            form[name] = Number(value);
        }
        else {
            form[name] = value;
        }
        indicators[name] = form[name];
        this.setState({
            indicatorsOfSuccess: indicators,
        });
        this.props.handleIndicatorsChange(this.state.indicators);
    };
    renderIndicators = () => {
        const { indicators } = this.state;
        return (
            <>
               <table className="application-table" style={{marginBottom: '10px'}}>
                    <tr>
                        <th className={'vertical_table_th'}>
                            <Trans>indicatorsObj.nameInd</Trans>
                        </th>
                        <th className={'vertical_table_th'}>
                            <Trans>indicatorsObj.unit</Trans>
                        </th>
                        <th className={'vertical_table_th'}>
                            <Trans>indicatorsObj.ultimateGoal</Trans>
                        </th>
                    </tr>
                {indicators && indicators.map((ind, idx) => (
                    idx !== 0 ? (
                        <>
                        <tr>
                            <td>
                                <input
                                    value={ind.name}
                                    className="expense-plan__input"
                                    id={`name_${idx}`}
                                    type="text"
                                    name="name"
                                    onChange={(event) =>
                                        this.handleInputChangeIndicators(event, idx)
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    value={ind.unit}
                                    className="expense-plan__input"
                                    id={`unit_${idx}`}
                                    type="text"
                                    name="unit"
                                    onChange={(event) =>
                                        this.handleInputChangeIndicators(event, idx)
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    value={ind.ultimateGoal}
                                    className="expense-plan__input"
                                    id={`ultimateGoal_${idx}`}
                                    type="number"
                                    name="ultimateGoal"
                                    onChange={(event) =>
                                        this.handleInputChangeIndicators(event, idx)
                                    }
                                />
                            </td>
                        </tr>
                        </>
                        )
                        :
                        (
                            <>
                                <tr>
                                    <td style={{backgroundColor: '#F7F7F7'}}>
                                        <p style={{whiteSpace: 'pre-line'}}>
                                            {i18next.t(ind.name)}
                                        </p>
                                    </td>
                                    <td style={{backgroundColor: '#F7F7F7'}}>
                                        <p style={{whiteSpace: 'pre-line'}}>
                                            {i18next.t(ind.unit)}
                                        </p>
                                    </td>
                                    <td style={{backgroundColor: '#F7F7F7'}}>
                                        <p style={{whiteSpace: 'pre-line'}}>
                                            {ind.ultimateGoal}
                                        </p>
                                    </td>
                                </tr>
                            </>
                        )
                        ))
                    }
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
