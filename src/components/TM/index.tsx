import React from 'react';
import {Trans} from "react-i18next";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import wrongText from '../../helpers/wrongText';
import FileComponent from '../FileComponent';
import Loader from "react-loader-spinner";
import { injectAppState } from '../../stores';
import {PG, SP} from "../../consts";
@injectAppState
class TM extends React.Component<any, any> {
    state = {
        teamMembers: this.props.teamMembers || null,
        fileLoading: {
            type: null,
            owner: null,
          },
    }
    handleInputChangeTM = (event, index) => {
        const target = event.target;
        let value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        const experiences = [...this.state.teamMembers];
        let form = experiences[index];
        if (name === "iin") {
            if (value.length > 12) {
                value = Math.max(0, value.toString().slice(0, 12));
                return;
            }
        }
        form[name] = value;

        this.setState({teamMembers: experiences});
        this.props.handleTMChange(this.state.teamMembers);
    };
    addTM = () => {
        let experienceForm = {
                email: "",
                iin: null,
                firstName: "",
                lastName: "",
                middleName: "",
                workExperience: null,
                role: "",
                resume: null,
            };
        const newExperience = {...experienceForm};
        const experiences = this.state.teamMembers ? [...this.state.teamMembers] : [];
        experiences.push(newExperience);
        this.state.teamMembers = experiences;
        this.props.handleTMChange(this.state.teamMembers);
    };
    deleteTM = (index) => {
        let experiences = [...this.state.teamMembers];
        if (experiences.length > 0) experiences.splice(index, 1);
        this.state.teamMembers = experiences;
        // this.setState({teamMembers: experiences});
        this.props.handleTMChange(this.state.teamMembers);
    };
    handleFileChange = (files, idx) => {
        if (files[0]) {
            this.props.appState.filesStore.uploadFile(files[0])
                .then((response) => {
                   let file = response.data;
                   console.log(file);
          this.state.teamMembers[idx].resume = {file: file};
          this.setState({ fileLoading: { type: null, owner: null } });
        })
        .catch((error) => {
          this.setState({ fileLoading: { type: null, owner: null } });
          wrongText("Error");
          console.log(error);
        });
        }
    }
    loadFile = (id) => {
        return this.props.appState.filesStore.downloadFile(id);
      };
    renderDocFile(doc) {
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
      renderFileLoader() {
          return (
            <Loader
              type="Triangle"
              color="#209898"
              height={37}
              width={37}
              timeout={15000}
            />
          );
      }
    render() {
        const { teamMembers } = this.state;
        console.log(this.props.program);
        return (
            <>
                {this.props.program !== PG && this.props.program !== SP &&
                    <h1 className={'extra-h1'}>
                        <Trans>RESOURCE</Trans>
                    </h1>}
            <div style={{margin: '27px 0px', flexDirection: 'column'}} className="application-table__tabs">
                <h1><Trans>teamM</Trans></h1>
                <br/>
                <p><Trans>teamMExtra</Trans></p>
                <br/>
            </div>
        <div className="application-table__body">
            <div className="application-table">
                <>
                    {teamMembers && teamMembers.map((tm, idx) => (
                        <table className="application-table" key={idx}>
                            <tr>
                                <th className={'tm-th'}><Trans>TeamMemberEmail</Trans></th>
                                <td className={'tm-td'}>
                                    <input
                                        value={tm.email}
                                        className="expense-plan__input"
                                        type="text"
                                        name="email"
                                        onChange={(event) => this.handleInputChangeTM(event, idx)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>IIN</Trans></th>
                                <td className={'tm-td'}>
                                    <input
                                        value={tm.iin}
                                        className="expense-plan__input"
                                        type="number"
                                        name="iin"
                                        onChange={(event) => this.handleInputChangeTM(event, idx)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>Name</Trans></th>
                                <td className={'tm-td'}>
                                    <input
                                        value={tm.firstName}
                                        className="expense-plan__input"
                                        type="text"
                                        name="firstName"
                                        onChange={(event) => this.handleInputChangeTM(event, idx)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>Surname</Trans></th>
                                <td className={'tm-td'}>
                                    <input
                                        value={tm.lastName}
                                        className="expense-plan__input"
                                        type="text"
                                        name="lastName"
                                        onChange={(event) => this.handleInputChangeTM(event, idx)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>Middlename</Trans></th>
                                <td className={'tm-td'}>
                                    <input
                                        value={tm.middleName}
                                        className="expense-plan__input"
                                        type="text"
                                        name="middleName"
                                        onChange={(event) => this.handleInputChangeTM(event, idx)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>WorkExperience</Trans></th>
                                <td className={'tm-td'}>
                                    <input
                                        value={tm.workExperience}
                                        className="expense-plan__input"
                                        type="number"
                                        name="workExperience"
                                        onChange={(event) => this.handleInputChangeTM(event, idx)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>specificRole</Trans></th>
                                <td className={'tm-td'}>
                                    <input
                                        value={tm.role}
                                        className="expense-plan__input"
                                        type="text"
                                        name="role"
                                        onChange={(event) => this.handleInputChangeTM(event, idx)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className={'tm-th'}><Trans>Resume</Trans></th>
                                <td className={'tm-td'}>
                                    <div className='inputfile__container' style={{justifyContent: 'center'}}>
                                        {this.renderDocFile(tm.resume)}
                                        {this.renderFileLoader}
                                        <label
                                            style={{fontSize: '14px', minWidth: '115px', marginLeft: '13px'}}
                                            htmlFor={`inputfileTM-${idx}`}
                                        >
                                            <Trans>ChooseFile</Trans>
                                        </label>
                                        <input
                                            type="file"
                                            id={`inputfileTM-${idx}`}
                                            onChange={(event) => this.handleFileChange(event.target.files, idx)}
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr className={'vertical_table_th'}>
                                <th className='empty_th'>

                                </th>
                                <td className='empty_td'>
                                    <img
                                        src={deleteIcon}
                                        alt=""
                                        className="delete_table_row"
                                        onClick={() => this.deleteTM(idx)}
                                    />
                                </td>
                            </tr>
                        </table>
                    ))}
                </>
            </div>
        </div>
        <div style={{paddingTop: '10px'}} className="add-expense__container">
            <button className="add-expense" onClick={this.addTM} disabled={this.state.teamMembers && this.state.teamMembers.length >= 10}>
                <Trans>Add</Trans>
            </button>
        </div>
            </>
    )
    }
}

export default TM;
