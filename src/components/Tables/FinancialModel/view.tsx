import React from 'react';
import { Trans } from "react-i18next";
import './styles.css';
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
            return null;
        }
        else if (!a && b) {
            return parseInt(b);
        }
        else if (!b && a) {
            return parseInt(a);
        }
        return parseInt(a) + parseInt(b);
    }
    calculateSubstr = (a, b, c) => {
        console.log(a)
        const tovary = b ? b.services : null;
        const rashody = this.calculateSum(a.marketing, a.directCosts);
        const donalogov = parseInt(tovary) - rashody;
        const pure = donalogov - parseInt(a.taxExpenses);
        if (c === 'pure') {
            return pure;
        }
        else if (c === 'donalogov') {
            return donalogov;
        }
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
                                type="number"
                                defaultValue={financialRevenue[0].services}
                                readOnly
                            />
                        </td>
                        <td>
                            <input
                                className="fn_input"
                                name="services"
                                type="number"
                                defaultValue={financialRevenue[1].services}
                                readOnly
                            />
                        </td>
                    </tr>
                    <tr>
                        <th><Trans>organizationPotential.totalRevenue</Trans></th>
                        <td className={'back-style'}>{financialRevenue[0].services}</td>
                        <td className={'back-style'}>{financialRevenue[1].services}</td>
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
                                type="number"
                                defaultValue={financialExpenses[0].directCosts}
                                readOnly
                            />
                        </td>
                        <td>
                            <input
                                className="fn_input"
                                name="directCosts"
                                type="number"
                                defaultValue={financialExpenses[1].directCosts}
                                readOnly
                            />
                        </td>
                    </tr>
                    <tr>
                        <th><Trans>organizationPotential.marketing</Trans></th>
                        <td>
                            <input
                                className="fn_input"
                                name="marketing"
                                type="number"
                                defaultValue={financialExpenses[0].marketing}
                                readOnly
                            />
                        </td>
                        <td>
                            <input
                                className="fn_input"
                                name="marketing"
                                type="number"
                                defaultValue={financialExpenses[1].marketing}
                                readOnly
                            />
                        </td>
                    </tr>
                    <tr>
                        <th><Trans>organizationPotential.totalExpenses</Trans></th>
                        {/*    calc */}
                        <td style={{background: '#f0f4fb'}}>{this.calculateSum(financialExpenses[0].marketing, financialExpenses[0].directCosts)}</td>
                        <td style={{background: '#f0f4fb'}}>{this.calculateSum(financialExpenses[1].marketing, financialExpenses[1].directCosts)}</td>
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
                                type="number"
                                defaultValue={financialExpenses[0].taxExpenses}
                                readOnly
                            />
                        </td>
                        <td>
                            <input
                                className="fn_input"
                                name="taxExpenses"
                                type="number"
                                defaultValue={financialExpenses[1].taxExpenses}
                                readOnly
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
        const prog = this.props.program.map((prog) => {return prog.name});
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
