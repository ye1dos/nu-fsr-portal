import React from 'react';
import {Trans} from "react-i18next";
import InputMask from 'react-input-mask';
import i18n from "../../i18n";
import i18next from "i18next";
class FieldApplicationForm extends React.Component<any, any> {
    state = {
        organizationName: this.props.applicationForm?.organizationName || null,
        activityDirection: this.props.applicationForm?.activityDirection || null,
        projectDuration: this.props.applicationForm?.projectDuration || null,
        applicantKind: this.props.applicationForm?.applicantKind || null,
        projectName: this.props.applicationForm?.projectName || null
    }

    render() {
        const appKind = [
            {name: "organization", value: "ORGANIZATION"},
            {name: "individual",value: "INDIVIDUAL"}
        ];
        const {organizationName, activityDirection, projectDuration, projectName} = this.state;
        return (
            <>
                <table className="talap-form" style={{width: '100%'}}>
                    <tbody>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>projectName</Trans></label>
                        </th>
                        <td>
                            <input value={projectName} readOnly className="general-info__input"/>
                        </td>
                    </tr>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>projectDuration</Trans></label>
                        </th>
                        <td>
                            <input value={projectDuration} readOnly className="general-info__input"/>
                        </td>
                    </tr>
                    <tr className="extra-tr">
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>applicantKind</Trans></label>
                            <p className={'extra-label'}><Trans>applicantKindExtra</Trans></p>
                        </th>
                        <td>
                            {appKind.map((o, idx) => (
                                <div key={idx} style={{padding: '10px', display: 'flex'}}>
                                    <input
                                        type="radio"
                                        name='applicantKind'
                                        id={'radioAppKind_' + idx}
                                        value={this.state.applicantKind}
                                        className="general-info__input__radio"
                                        checked={this.state.applicantKind === o.value}
                                        readOnly={this.state.applicantKind !== o.value}
                                    />
                                    <label className={'general-info__input__radio-label'} htmlFor={`radioAppKind_${idx}`}>
                                        {i18next.t(o.name)}
                                    </label>
                                </div>
                            ))}
                        </td>
                    </tr>
                    {
                        this.state.applicantKind === "ORGANIZATION" ?
                        (<>
                            <tr className={'extra-tr'}>
                                <th>
                                    <label className={'main-label'} htmlFor=""><Trans>organizationName</Trans></label>
                                </th>
                                <td>
                                    <input value={organizationName} readOnly className="general-info__input"/>
                                </td>
                            </tr>
                            <tr className={'extra-tr'}>
                                <th>
                                    <label className={'main-label'} htmlFor=""><Trans>activityDirection</Trans></label>
                                    <p className={'extra-label'}><Trans>activityDirectionExtra</Trans></p>
                                </th>
                                <td>
                                    <input value={activityDirection} readOnly className="general-info__input"/>
                                </td>
                            </tr>
                        </>) : null
                    }
                    </tbody>
                </table>
            </>
        );
    }
}

export default FieldApplicationForm;
