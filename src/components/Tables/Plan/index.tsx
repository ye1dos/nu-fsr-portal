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
    addPlan = () => {
        const planForm = {
            event: null,
            description: null,
            deadline: null,
            number: Math.random() * 1000,
        }
        const newExperience = planForm;
        const plan = this.state.plan ? [...this.state.plan] : [];
        plan.push(newExperience);
        this.state.plan = plan;
        this.props.handlePlanChange(this.state.plan);
    };
    deletePlan = (index) => {
        let plan = [...this.state.plan];
        if (plan.length > 0) plan.splice(index, 1);
        this.state.plan = plan;
        this.props.handlePlanChange(this.state.plan);
    };
    handleInputChangePlan = (event, index) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        const plan = this.state.plan;
        let form = plan[index];
        form[name] = value;
        plan[name] = form[name];
        this.state.plan = plan;
        this.props.handlePlanChange(this.state.plan);
    };
    handleDateChange = (d, idx) => {
        const plan = this.state.plan;
        let form = plan[idx];
        form['deadline'] = d;
        plan[idx]['deadline'] = form['deadline'];
        this.setState({
            plan: plan,
        });
        this.props.handlePlanChange(this.state.plan);
    };
    renderPlan() {
        const prog = this.props.program?.map((prog, idx) => {
            return prog.name
        });
        const { plan } = this.state;
        return (
            <>
                <table className="application-table m-b-20">
                    <tr>
                        <th>
                            <Trans>event</Trans>
                        </th>
                        <th>
                            <Trans>deadline</Trans>
                        </th>
                        <th>
                            <Trans>descriptionEfficiency</Trans>
                        </th>
                    </tr>
                    {plan && plan.map((plan, idx) => (
                        <tr>
                            <td>
                                <input
                                    value={plan.event}
                                    className="expense-plan__input"
                                    type="text"
                                    name="event"
                                    onChange={(event) =>
                                        this.handleInputChangePlan(event, idx)
                                    }
                                />
                            </td>
                            <td>
                                <DatePickerMultiComponent
                                    selected={plan.deadline}
                                    idx={idx}
                                    handleChangeDate={this.handleDateChange}
                                />
                            </td>
                            <td>
                                <input
                                    value={plan.description}
                                    className="expense-plan__input"
                                    type="text"
                                    name="description"
                                    onChange={(event) =>
                                        this.handleInputChangePlan(event, idx)
                                    }
                                />
                            </td>
                            <td className={'empty_td'}>
                                <img
                                    src={deleteIcon}
                                    alt=""
                                    className="delete_table_row"
                                    onClick={() => this.deletePlan(idx)}
                                />
                            </td>
                        </tr>
                    ))}
                </table>
            </>
        )
    }
    render () {
        const prog = this.props.program.map((prog) => {return prog.name});
        return (
            <>
                <p className='main-label' style={{marginBottom: '12px', marginTop: '24px'}}>
                    {renderHeader(prog)}
                </p>
                <p style={{marginBottom: '12px'}} className={'extra-label'}><Trans>planExtra</Trans></p>
                <div className="application-table__body">
                    <div className="application-table">{this.renderPlan()}</div>
                </div>
                <div className="add-expense__container">
                    <button className="add-expense" onClick={this.addPlan}>
                        <Trans>Add</Trans>
                    </button>
                </div>
            </>
        )
    }
}
export default Plan;
