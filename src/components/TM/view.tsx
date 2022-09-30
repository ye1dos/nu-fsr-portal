import React from 'react';
import {Trans} from "react-i18next";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import FileComponent from "../FileComponent";
import './TM.css'
import {toJS} from "mobx";
import {injectAppState} from "../../stores";
import {observer} from "mobx-react";
import {PG, SP} from "../../consts";
@injectAppState
@observer
class TM extends React.Component<any, any> {
    state = {
        teamMembers: this.props.teamMembers || null
    }
    loadFile = (id) => {
        return this.props.appState.filesStore.downloadFile(id);
    };
    renderDocFile = (doc) => {
        if (doc) {
            return (
                <FileComponent
                    getFile={this.loadFile}
                    id={doc.file.id}
                    name={doc.file.name}
                    extension={doc.file.extension}
                    withFileIcon={false}
                    withDownloadIcon={false}
                />
            );
        }
    }
    private width: any;
    render() {
        const { teamMembers } = this.state;
        return (
            <>
                {this.props.program !== PG && this.props.program !== SP && <h1 className={'extra-h1'}><Trans>RESOURCE</Trans></h1>}
            <div style={{margin: '27px 0px', flexDirection: 'column'}} className="application-table__tabs">
                <h1><Trans>teamM</Trans></h1>
                <br/>
                <p><Trans>teamMExtra</Trans></p>
                <br/>
            </div>
        <div className="application-table__body">
            <div style={{width: '100%', position: 'relative'}}>
                <>
                    {teamMembers && teamMembers.map((experience, idx) => (
                        <table className="application-table" key={idx}>
                            <tr>
                                <th className={'tm-th'}><Trans>TeamMemberEmail</Trans></th>
                                <td className={'tm-td'}>
                                    <label>{experience.email}</label>
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>IIN</Trans></th>
                                <td className={'tm-td'}>
                                    <label>{experience.iin}</label>
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>Name</Trans></th>
                                <td className={'tm-td'}>
                                    <label>{experience.firstName}</label>
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>Surname</Trans></th>
                                <td className={'tm-td'}>
                                    <label>{experience.lastName}</label>
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>Middlename</Trans></th>
                                <td className={'tm-td'}>
                                    <label>{experience.middleName}</label>
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>WorkExperience</Trans></th>
                                <td className={'tm-td'}>
                                    <label>{experience.workExperience}</label>
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>specificRole</Trans></th>
                                <td className={'tm-td'}>
                                    <label>{experience.role}</label>
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>Resume</Trans></th>
                                <td className={'tm-td'}>
                                    {this.renderDocFile(experience.resume)}
                                </td>
                            </tr>
                        </table>
                    ))}
                </>
            </div>
        </div>
        </>
    )
    }
}

export default TM;
