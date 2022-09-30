import React from 'react';
import {Trans} from "react-i18next";
import InputMask from 'react-input-mask';
import i18n from "../../i18n";
import i18next from "i18next";
import DatePickerMultiComponent from "../DatePickerMulti";
class FieldApplicationForm extends React.Component<any, any> {
    state = {
        organizationName: this.props.applicationForm?.organizationName || null,
        activityDirection: this.props.applicationForm?.activityDirection || null,
        projectDuration: this.props.applicationForm?.projectDuration || null,
        applicantKind: this.props.applicationForm?.applicantKind || null,
        projectName: this.props.applicationForm?.projectName || null,
        application: this.props.app_id ? {id: this.props.app_id} : null,
    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.state[name] = value;
        this.props.handleApplicationFormChange(this.state);
    }
    handleRadioChange = (event, value) => {
        this.state.applicantKind = value;
        this.props.handleApplicationFormChange(this.state);
    }
    handleDateChange = (d, idx) => {
        this.state.projectDuration = d;
        this.props.handleApplicationFormChange(this.state);
    }
    render() {
        const appKind = [
            {name: "organization", value: "ORGANIZATION"},
            {name: "individual",value: "INDIVIDUAL"}
        ];
        const {organizationName, activityDirection, projectDuration, projectName} = this.state;
        return (
            <>
                <table className="application-table" style={{width: '100%', marginTop: '30px', textAlign: 'center'}}>
                    <tr>
                        <th>
                            <label
                                className={'vertical_table_th'}
                                htmlFor="">
                                <Trans>projectName</Trans>
                            </label>
                        </th>
                        <td>
                            <input
                                className="expense-plan__input"
                                defaultValue={projectName}
                                name="projectName"
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label
                                className={'vertical_table_th'}
                                htmlFor="">
                                <Trans>projectDuration</Trans>
                            </label>
                        </th>
                        <td>
                            <DatePickerMultiComponent
                                selected={projectDuration}
                                handleChangeDate={this.handleDateChange}
                                idx={null}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label
                                className={'vertical_table_th'}
                                htmlFor="">
                                <Trans>applicantKind</Trans>
                            </label>
                            <p><Trans>applicantKindExtra</Trans></p>
                        </th>
                        <td>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                                {appKind.map((o, idx) => (
                                    <div key={idx}>
                                        <input
                                            type="radio"
                                            name='applicantKind'
                                            id={'radioAppKind_' + idx}
                                            checked={o.value === this.state.applicantKind}
                                            value={this.state.applicantKind}
                                            onChange={(event) =>
                                                this.handleRadioChange(event, o.value)
                                            }
                                            className="general-info__input__radio"
                                        />
                                        <label className={'general-info__input__radio-label'} htmlFor={`radioAppKind_${idx}`}>
                                            {i18next.t(o.name)}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </td>
                    </tr>
                    {
                        this.state.applicantKind === "ORGANIZATION" ?
                        (<>
                            <tr>
                                <th>
                                    <label
                                        className={'vertical_table_th'}
                                        htmlFor="">
                                        <Trans>organizationName</Trans>
                                    </label>
                                </th>
                                <td>
                                    <input
                                        className="expense-plan__input"
                                        defaultValue={organizationName}
                                        name="organizationName"
                                        onChange={this.handleInputChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <label
                                        className={'vertical_table_th'}
                                        htmlFor="">
                                        <Trans>activityDirection</Trans>
                                    </label>
                                    <p><Trans>activityDirectionExtra</Trans></p>
                                </th>
                                <td>
                                    <input
                                        className="expense-plan__input"
                                        defaultValue={activityDirection}
                                        name="activityDirection"
                                        onChange={this.handleInputChange}
                                    />
                                </td>
                            </tr>
                        </>) : null
                    }
                </table>
            </>
        );
    }
}

export default FieldApplicationForm;
