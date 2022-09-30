import React from 'react';
import { Trans } from "react-i18next";
import deleteIcon from "../../../assets/icons/delete-icon.svg";
import {PG, SG} from "../../../consts";
import renderHeader from "./title";
class Indicators extends React.Component<any, any> {
    state = {
        indicators: this.props.indicators || [

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
            {
                unit: '',
                name: '',
                ultimateGoal: '',
            },
        ],
    }
    addIndicators = () => {
        const indForm = {
            name: "",
            unit: "",
            ultimateGoal: null,
        }
        const newExperience = indForm;
        const indicatorsOfSuccess = this.state.indicators ? [...this.state.indicators] : [];
        let length = indicatorsOfSuccess.length;
        // for (let i = 0; i < length; i++) {
        //     // @ts-ignore
        //     document.getElementById(`name_${i}`).disabled = true;
        //     // @ts-ignore
        //     document.getElementById(`unit_${i}`).disabled = true;
        //     // @ts-ignore
        //     document.getElementById(`ultimateGoal_${i}`).disabled = true;
        // }
        indicatorsOfSuccess.push(newExperience);
        this.state.indicators = indicatorsOfSuccess;
        this.props.handleIndicatorsChange(this.state.indicators);
    }
    deleteIndicators = (index) => {
        let ind = [...this.state.indicators];
        if (ind.length > 0) ind.splice(index, 1);
        this.state.indicators = ind;
        this.props.handleIndicatorsChange(this.state.indicators);
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
                <table className="application-table m-b-20">
                    <tr>
                        <th style={{whiteSpace: 'normal'}}>
                            <Trans>indicatorsObj.nameInd</Trans>
                        </th>
                        <th style={{whiteSpace: 'normal'}}>
                            <Trans>indicatorsObj.unit</Trans>
                        </th>
                        <th style={{whiteSpace: 'normal'}}>
                            <Trans>indicatorsObj.ultimateGoal</Trans>
                        </th>
                    </tr>
                    {indicators && indicators.map((ind, idx) => (
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
                                {/* <td className={'empty_td'}>
                                    <img
                                        src={deleteIcon}
                                        alt=""
                                        className="delete_table_row"
                                        onClick={() => this.deleteIndicators(idx)}
                                    />
                                </td> */}
                            </tr>
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
                {/* <div className="add-expense__container">
                    <button className="add-expense" onClick={this.addIndicators}>
                        <Trans>Add</Trans>
                    </button>
                </div> */}
            </>
        )
    }
}
export default Indicators;
