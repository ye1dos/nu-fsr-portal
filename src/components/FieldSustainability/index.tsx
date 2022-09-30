import React from 'react';
import {Trans} from "react-i18next";

class FieldSustainability extends React.Component<any, any> {
    state = {
        customer: this.props.sustainability?.customer || null,
        scaling: this.props.sustainability?.scaling || null,
        financialModel: this.props.sustainability?.financialModel || {
            expenditure: null,
            costAndVolume: null,
            incomeSource: null,
            incomeDistribution: null,
        },
        application: this.props.app_id ? {id: this.props.app_id} : null,
    };
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.state[name] = value;
        this.props.handleSustainabilityChange(this.state);
    };
    handleInputChangeFinancialModel = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.state.financialModel[name] = value;
        this.props.handleSustainabilityChange(this.state);
    };

    render() {
        const {customer, scaling} = this.state;
        return (
            <>
                <h1 className={'extra-h1'}><Trans>USTOI4IVOST</Trans></h1>
                <table className="talap-form">
                    <tbody>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>customer</Trans></label>
                            <p className={'extra-label'}><Trans>customerExtra</Trans></p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={customer}
                                name="customer"
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="application-table__body">
                    <p className='main-label' style={{marginBottom: '12px', marginTop: '24px'}}>
                        <Trans>financialModel.financialModel</Trans></p>
                    <table className="application-table">{this.renderFinancialModel()}</table>
                </div>
                <table className="talap-form">
                    <tbody>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>scaling</Trans></label>
                            <p className={'extra-label'}><Trans>scalingExtra</Trans></p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={scaling}
                                name="scaling"
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </>
        )
    }

    renderFinancialModel() {
        const {financialModel} = this.state;
        return (
            <>
                <table className="application-table_financialModel">
                    <tr>
                        <th className={'vertical_table_th_fn'}>
                            <p><Trans>expenditure</Trans></p>
                            <p><Trans>expenditureExtra</Trans></p>
                        </th>
                        <td style={{width: '100%'}}>
                            <input
                                value={financialModel.expenditure}
                                className="expense-plan__input"
                                type="text"
                                name="expenditure"
                                onChange={(event) =>
                                    this.handleInputChangeFinancialModel(event)
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <th className={'vertical_table_th_fn'}>
                            <p className={'white-space-normal'}><Trans>financialModel.costAndVolume</Trans></p>
                            <p className={'white-space-normal'}><Trans>financialModel.costAndVolumeExtra</Trans></p>
                        </th>
                        <td style={{width: '100%'}}>
                            <input
                                value={financialModel.costAndVolume}
                                className="expense-plan__input"
                                type="text"
                                name="costAndVolume"
                                onChange={(event) =>
                                    this.handleInputChangeFinancialModel(event)
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <th className={'vertical_table_th_fn'}>
                            <p><Trans>financialModel.incomeSource</Trans></p>
                            <p><Trans>financialModel.incomeSourceExtra</Trans></p>
                        </th>
                        <td style={{width: '100%'}}>
                            <input
                                value={financialModel.incomeSource}
                                className="expense-plan__input"
                                type="text"
                                name="incomeSource"
                                onChange={(event) =>
                                    this.handleInputChangeFinancialModel(event)
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <th className={'vertical_table_th_fn'}>
                            <p><Trans>financialModel.incomeDistribution</Trans></p>
                            <p style={{whiteSpace: 'normal'}}><Trans>financialModel.incomeDistributionExtra</Trans></p>
                        </th>
                        <td style={{width: '100%'}}>
                            <input
                                value={financialModel.incomeDistribution}
                                className="expense-plan__input"
                                type="text"
                                name="incomeDistribution"
                                onChange={(event) =>
                                    this.handleInputChangeFinancialModel(event)
                                }
                            />
                        </td>
                    </tr>
                </table>
            </>
        )
    }
}

export default FieldSustainability;
