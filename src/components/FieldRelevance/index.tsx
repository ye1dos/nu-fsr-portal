import React from 'react';
import { Trans } from "react-i18next";
class FieldRelevance extends React.Component<any, any> {
    state = {
        beneficiaty: this.props.relevance?.beneficiaty || null,
        socialProblem: this.props.relevance?.socialProblem || null,
        couse: this.props.relevance?.couse || null,
        territory: this.props.relevance?.territory || null,
        application: this.props.app_id ? { id: this.props.app_id} : null,
    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.state[name] = value;
        this.props.handleRelevanceChange(this.state);
    }
    render () {
        const { couse, beneficiaty, socialProblem, territory } = this.state;
        return (
            <>
                <h1 className={'extra-h1'}><Trans>ACTUALNOST</Trans></h1>
                <table style={{paddingTop: "20px"}} className="talap-form">
                    <tbody>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>socialProblem</Trans></label>
                            <p className={'extra-label'}><Trans>socialProblemExtra</Trans></p>
                        </th>
                        <td>
                      <textarea
                          className="table__text"
                          defaultValue={socialProblem}
                          name="socialProblem"
                          onChange={this.handleInputChange}
                      />
                        </td>
                    </tr>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>couse</Trans></label>
                            <p className={'extra-label'}><Trans>couseExtra</Trans></p>
                        </th>
                        <td>
                      <textarea
                          className="table__text"
                          defaultValue={couse}
                          name="couse"
                          onChange={this.handleInputChange}
                      />
                        </td>
                    </tr>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>territory</Trans></label>
                            <p className={'extra-label'}><Trans>territoryExtra</Trans></p>
                        </th>
                        <td>
                      <textarea
                          className="table__text"
                          defaultValue={territory}
                          name="territory"
                          onChange={this.handleInputChange}
                      />
                        </td>
                    </tr>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>beneficiaty</Trans></label>
                            <p className={'extra-label'}><Trans>beneficiatyExtra</Trans></p>
                        </th>
                        <td>
                      <textarea
                          className="table__text"
                          defaultValue={beneficiaty}
                          name="beneficiaty"
                          onChange={this.handleInputChange}
                      />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </>
        )
    }
    }
export default FieldRelevance;
