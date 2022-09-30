import React from 'react';
import { Trans } from "react-i18next";
import FinancialModel from "../Tables/FinancialModel/view";
class FieldOrganizationPotential extends React.Component<any, any> {
    state = {
        operatingBusiness: this.props.organizationPotential?.operatingBusiness || null,
        financialRevenue: this.props.organizationPotential?.financialRevenue || null,
        financialExpenses: this.props.organizationPotential?.financialExpenses  || null,
        application: this.props.app_id ? { id: this.props.app_id} : null,
    }
    render () {
        const { operatingBusiness, financialRevenue, financialExpenses } = this.state;
        return (
            <>
                <h1 className={'extra-h1'}>
                    <Trans>organizationPotential.title</Trans>
                </h1>
                <table className="talap-form">
                    <tbody>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>organizationPotential.operatingBusiness</Trans></label>
                            <p className={'extra-label'}><Trans>organizationPotential.operatingBusinessExtra</Trans></p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={operatingBusiness}
                                name="operatingBusiness"
                                readOnly
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <FinancialModel
                    program={this.props.program}
                    financialRevenue={financialRevenue}
                    financialExpenses={financialExpenses}
                />

            </>
        )
    }
}
export default FieldOrganizationPotential;
