import React from 'react';
import { Trans } from "react-i18next";
import renderTitle from "./title";
import {IG} from "../../consts";
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
    }
    render () {
        const { product, clientPortrait, marketingChannels } = this.state;
        
        const prog = this.props.program?.map((prog) => {return prog.name});
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
                                readOnly
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
                                readOnly
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
                                readOnly
                            />
                        </td>
                    </tr>
                    <div className="application-table__body" style={{marginTop: '20px'}}>
                        <p style={{marginBottom: '12px', marginTop: '24px'}} className={'main-label'}><Trans>businessModel.FMBase</Trans></p>
                        <p style={{marginBottom: '12px'}} className={'extra-label'}>
                            <Trans>businessModel.FMBaseExtra</Trans></p>
                        <table className="application-table">{this.renderFinancialModel()}</table>
                    </div>
                    </tbody>
                </table>
            </>
        )
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
                        <label>{financialModel.costAndVolume}</label>
                    </td>
                </tr>
                <tr >
                    <th  className={'vertical_table_th'}>
                        <Trans>expenditure</Trans>
                    </th>
                    <td>
                        <label>{financialModel.expenditure}</label>
                    </td>
                </tr>
                <tr >
                    <th  className={'vertical_table_th'}>
                        <Trans>financialModel.incomeDistribution</Trans>
                    </th>
                    <td>
                        <label>{financialModel.incomeDistribution}</label>
                    </td>
                </tr>
            </>
        )
    }
}
export default BusinessModel;
