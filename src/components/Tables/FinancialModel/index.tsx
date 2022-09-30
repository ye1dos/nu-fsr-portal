import React from 'react';
import { Trans } from "react-i18next";
import './styles.css';
import convertToMasked from "../../../helpers/pure/convertToMasked";
import {IG} from "../../../consts";
import renderHeader from "./title";
class FinancialModel extends React.Component<any, any> {
    state = {
        financialExpenses: this.props.financialExpenses || [
            {
                year: '2020',
                taxExpenses: '',
                marketing: '',
                directCosts: '',
            },
            {
                year: '2021',
                taxExpenses: '',
                marketing: '',
                directCosts: '',
            }
        ],
        financialRevenue: this.props.financialRevenue || [
            {
                year: '2020',
                services: '',
            },
            {
                year: '2021',
                services: '',
            }
        ],
    }
    calculateSum = (a, b) => {
        if (!a && !b) {
            return 0;
        }
        else if (!a && b) {
            return parseInt(b);
        }
        else if (!b && a) {
            return parseInt(a);
        }
        return parseInt(a) + parseInt(b);
    }
    calculateSumWithMask = (a, b) => {
        let num = null;
        if (!a && !b) {
            return null;
        }
        else if (!a && b) {
            num = parseInt(b);
        }
        else if (!b && a) {
            num =  parseInt(a);
        }
        else {
            num = parseInt(a) + parseInt(b);
        }
        return convertToMasked(num);
    }
    calculateSubstr = (a, b, c) => {
        const tovary = b ? b.services : 0;
        const rashody = this.calculateSum(a.marketing, a.directCosts);
        const donalogov = tovary - 0 - rashody;
        const pure = donalogov - a.taxExpenses - 0;
        if (c === 'pure') {
            if (isNaN(pure)) return 0;
            return convertToMasked(pure);
        }
        else if (c === 'donalogov') {
            if (isNaN(donalogov)) return 0;
            return convertToMasked(donalogov);
        }
    }
    handleFRChange = (event, idx) => {
        const target = event.target;
        // const value = target.value;
        const name = target.name;
        let num = Number(target.value.replace(/[^ -~]/g, ''));
        if (isNaN(num)) {
            num = 0;
        }
        let value = num;
        this.state.financialRevenue[idx][name] = value;
        this.props.handleFRChange(this.state.financialRevenue);
    }
    handleFEChange = (event, year) => {
        const target = event.target;
        // const value = target.value;
        const name = target.name;
        let num = Number(target.value.replace(/[^ -~]/g, ''));
        console.log(target.value)
        if (isNaN(num)) {
            num = 0;
        }
        let value = num;
        this.state.financialExpenses[year][name] = value;
        this.props.handleFEChange(this.state.financialExpenses);
    }
    renderFinancialModel = () => {
        const { financialRevenue, financialExpenses } = this.state;
        return (
            <>
                <table className="fn_table">
                    <tr style={{textAlign: 'center'}}>
                        <th></th>
                        <th>2020</th>
                        <th>2021</th>
                    </tr>
                    <tr style={{background: '#ffffff', border: '1px solid #b7d1ff'}}>
                        <p className={'fn_table-title'}><Trans>organizationPotential.financialRevenue</Trans></p>
                    </tr>
                    <tr>
                        <th><Trans>organizationPotential.goods</Trans></th>
                        <td>
                            <input
                                className="fn_input"
                                name="services"
                                type="text"
                                value={(financialRevenue[0].services && (financialRevenue[0].services).toLocaleString())}
                                onChange={(e) => this.handleFRChange( e, 0)}
                            />
                        </td>
                        <td>
                            <input
                                className="fn_input"
                                name="services"
                                type="text"
                                value={financialRevenue[1].services && (financialRevenue[1].services).toLocaleString()}
                                onChange={(e) => this.handleFRChange(e, 1)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th><Trans>organizationPotential.totalRevenue</Trans></th>
                        <td style={{background: '#f0f4fb'}}>{convertToMasked(financialRevenue[0].services)}</td>
                        <td style={{background: '#f0f4fb'}}>{convertToMasked(financialRevenue[1].services)}</td>
                    </tr>
                    <tr style={{background: '#ffffff', border: '1px solid #b7d1ff'}}>
                        <p className={'fn_table-title'}><Trans>organizationPotential.financialExpenses</Trans></p>
                    </tr>
                    <tr>
                        <th><Trans>organizationPotential.direct</Trans></th>
                        <td>
                            <input
                                className="fn_input"
                                name="directCosts"
                                type="text"
                                value={financialExpenses[0].directCosts && (financialExpenses[0].directCosts).toLocaleString()}
                                onChange={(e) => this.handleFEChange( e, 0)}
                            />
                        </td>
                        <td>
                            <input
                                className="fn_input"
                                name="directCosts"
                                type="text"
                                value={financialExpenses[1].directCosts && (financialExpenses[1].directCosts).toLocaleString()}
                                onChange={(e) => this.handleFEChange(e, 1)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th><Trans>organizationPotential.marketing</Trans></th>
                        <td>
                            <input
                                className="fn_input"
                                name="marketing"
                                type="text"
                                value={financialExpenses[0].marketing && (financialExpenses[0].marketing).toLocaleString()}
                                onChange={(e) => this.handleFEChange( e, 0)}
                            />
                        </td>
                        <td>
                            <input
                                className="fn_input"
                                name="marketing"
                                type="text"
                                value={financialExpenses[1].marketing && financialExpenses[1].marketing.toLocaleString()}
                                onChange={(e) => this.handleFEChange(e, 1)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th><Trans>organizationPotential.totalExpenses</Trans></th>
                    {/*    calc */}
                        <td style={{background: '#f0f4fb'}}>{this.calculateSumWithMask(financialExpenses[0].marketing, financialExpenses[0].directCosts)}</td>
                        <td style={{background: '#f0f4fb'}}>{this.calculateSumWithMask(financialExpenses[1].marketing, financialExpenses[1].directCosts)}</td>
                    </tr>
                    <tr>
                        <th><Trans>organizationPotential.income</Trans></th>
                    {/*    calc */}
                        <td style={{background: '#f0f4fb'}}>
                            {this.calculateSubstr(financialExpenses[0], financialRevenue[0],'donalogov')}
                        </td>
                        <td style={{background: '#f0f4fb'}}>
                            {this.calculateSubstr(financialExpenses[1], financialRevenue[1], 'donalogov')}
                        </td>
                    </tr>
                    <tr>
                        <th><Trans>organizationPotential.tax</Trans></th>
                        <td>
                            <input
                                className="fn_input"
                                name="taxExpenses"
                                type="text"
                                value={(financialExpenses[0].taxExpenses && financialExpenses[0].taxExpenses.toLocaleString())}
                                onChange={(e) => this.handleFEChange( e, 0)}
                            />
                        </td>
                        <td>
                            <input
                                className="fn_input"
                                name="taxExpenses"
                                type="text"
                                value={(financialExpenses[1].taxExpenses && financialExpenses[1].taxExpenses.toLocaleString())}
                                onChange={(e) => this.handleFEChange( e, 1)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th><Trans>organizationPotential.netIncome</Trans></th>
                    {/*    calc */}
                        <td style={{background: '#f0f4fb'}}>
                            {this.calculateSubstr(financialExpenses[0], financialRevenue[0], 'pure')}
                        </td>
                        <td style={{background: '#f0f4fb'}}>
                            {this.calculateSubstr(financialExpenses[1], financialRevenue[1], 'pure')}
                        </td>
                    </tr>
                </table>
            </>
        )
    }
    render () {
        const prog = this.props.program.map(prog => {return prog.name});
        return (
            <>
                <p className='main-label' style={{marginBottom: '12px', marginTop: '24px'}}>{renderHeader(prog)}</p>
                <p style={{marginBottom: '12px'}} className={'extra-label'}><Trans>organizationPotential.modelExtra</Trans></p>
                <div className="application-table__body">
                    <div className="application-table">{this.renderFinancialModel()}</div>
                </div>
            </>
        )
    }
}
export default FinancialModel;
