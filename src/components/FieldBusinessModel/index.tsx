import React from 'react';
import { Trans } from "react-i18next";
import {IG} from "../../consts";
import renderTitle from "./title";
class BusinessModel extends React.Component<any, any> {
    state = {
        clientPortrait: this.props.businessModel?.clientPortrait || null,
        product: this.props.businessModel?.product || null,
        marketingChannels: this.props.businessModel?.marketingChannels || null,
        financialModel: this.props.businessModel?.financialModel || {
            expenditure: null,
            costAndVolume: null,
            incomeSource: null,
            incomeDistribution: null,
        },
        application: this.props.app_id ? { id: this.props.app_id} : null,
    };
    // should add applicant in innovativeness
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.state[name] = value;
        this.props.handleBusinessModelChange(this.state);
    };
    handleInputChangeFM = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.state.financialModel[name] = value;
        this.props.handleBusinessModelChange(this.state);
    };
    render () {
        const { product, clientPortrait, marketingChannels, financialModel } = this.state;
        const prog = this.props.program.map((prog) => {return prog.name});
        return (
            <>
                <h1 className={'extra-h1'}>
                    {renderTitle(prog)}
                </h1>
                <table className="talap-form">
                    <tbody>
                    {prog && prog[0] !== IG && <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>businessModel.product</Trans></label>
                            <p className={'extra-label'}><Trans>businessModel.productExtra</Trans></p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={product}
                                name="product"
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>}
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>businessModel.portrait</Trans></label>
                            <p className={'extra-label'}>
                                <Trans>businessModel.portraitExtra</Trans>
                            </p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={clientPortrait}
                                name="clientPortrait"
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>projectIdea.marketingChannels</Trans></label>
                            <p className={'extra-label'}>
                                <Trans>projectIdea.marketingChannelsExtra</Trans>
                            </p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={marketingChannels}
                                name="marketingChannels"
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>
                    <div className="application-table__body" style={{marginTop: '20px'}}>
                        <p style={{marginBottom: '12px', marginTop: '24px'}} className={'main-label'}>{this.renderHeading(prog)}</p>
                        <p style={{marginBottom: '12px'}} className={'extra-label'}>
                            <Trans>businessModel.FMBaseExtra</Trans></p>
                        <table className="application-table">{this.renderFinancialModel()}</table>
                    </div>
                    </tbody>
                </table>
            </>
        )
    }
    renderHeading = (prog) => {
        if (prog[0] === IG) {
            return <Trans>businessModel.FMBaseIG</Trans>;
        }
        return <Trans>businessModel.FMBase</Trans>;
    }
    renderFinancialModel () {
        const { financialModel } = this.state;
        return (
            <>
                        <tr>
                            <th className={'vertical_table_th'}>
                                <Trans>financialModel.costAndVolume</Trans>
                            </th>
                            <td>
                                <input
                                    value={financialModel.costAndVolume}
                                    className="expense-plan__input"
                                    type="text"
                                    name="costAndVolume"
                                    onChange={(event) =>
                                        this.handleInputChangeFM(event)
                                    }
                                />
                            </td>
                        </tr>
                        <tr >
                            <th  className={'vertical_table_th'}>
                                <Trans>expenditure</Trans>
                            </th>
                            <td>
                                <input
                                    value={financialModel.expenditure}
                                    className="expense-plan__input"
                                    type="text"
                                    name="expenditure"
                                    onChange={(event) =>
                                        this.handleInputChangeFM(event)
                                    }
                                />
                            </td>
                        </tr>
                        <tr >
                            <th  className={'vertical_table_th'}>
                                <Trans>financialModel.incomeDistribution</Trans>
                            </th>
                            <td>
                                <input
                                    value={financialModel.incomeDistribution}
                                    className="expense-plan__input"
                                    type="text"
                                    name="incomeDistribution"
                                    onChange={(event) =>
                                        this.handleInputChangeFM(event)
                                    }
                                />
                            </td>
                        </tr>
            </>
        )
    }
}
export default BusinessModel;
