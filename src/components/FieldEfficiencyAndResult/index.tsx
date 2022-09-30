import React from 'react';
import {Trans} from "react-i18next";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import InputMask from "react-input-mask";
import i18n from "../../i18n";
import DatePickerMultiComponent from "../DatePickerMulti";
import {SP} from "../../consts";
import Indicators from "../Tables/Indicators";
import Plan from "../Tables/Plan";
class FieldEfficiencyAndResult extends React.Component<any, any> {
    state = {
        projectCoverage: this.props.efficiencyAndResult?.projectCoverage || null,
        indicators: this.props.efficiencyAndResult?.indicators || null,
        socialContribution: this.props.efficiencyAndResult?.socialContribution || null,
        goalAndTask: this.props.efficiencyAndResult?.goalAndTask || null,
        plan: this.props.efficiencyAndResult?.plan || null,
        application: this.props.app_id ? {id: this.props.app_id} : null,
    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.state[name] = value;
        this.props.handleEfficiencyAndResultChange(this.state);
    }
    handlePlanChange = (plan) => {
        this.setState({plan: plan});
        this.props.handleEfficiencyAndResultChange(this.state);
    }
    handleIndicatorsChange = (indicators) => {
        this.setState({indicators: indicators});
        this.props.handleEfficiencyAndResultChange(this.state);
    }
    render() {
        const {projectCoverage, indicators, socialContribution, goalAndTask} = this.state;
        return (
            <>
                <h1 className={'extra-h1'}><Trans>EFFECTIVNOST</Trans></h1>
                <table style={{paddingTop: "20px"}} className="talap-form">
                    <tbody>
              {/*      <tr className={'extra-tr'}>*/}
              {/*          <th>*/}
              {/*              <label className='main-label' htmlFor=""><Trans>goalAndTask</Trans></label>*/}
              {/*              <p className={'extra-label'}><Trans>goalAndTaskExtra</Trans></p>*/}
              {/*          </th>*/}
              {/*          <td>*/}
              {/*              <textarea*/}
              {/*                  className="table__text"*/}
              {/*                  defaultValue={goalAndTask}*/}
              {/*                  name="goalAndTask"*/}
              {/*                  onChange={this.handleInputChange}>*/}
              {/*              </textarea>*/}
              {/*          </td>*/}
              {/*      </tr>*/}
              {/*      <tr className={'extra-tr'}>*/}
              {/*          <th>*/}
              {/*              <label className='main-label' htmlFor=""><Trans>indicatorsOfSuccess</Trans></label>*/}
              {/*              <p className={'extra-label'}><Trans>indicatorsOfSuccessExtra</Trans></p>*/}
              {/*          </th>*/}
              {/*          <td>*/}
              {/*      <textarea*/}
              {/*          className="table__text"*/}
              {/*          defaultValue={indicatorsOfSuccess}*/}
              {/*          name="indicatorsOfSuccess"*/}
              {/*          onChange={this.handleInputChange}*/}
              {/*              />*/}
              {/*          </td>*/}
              {/*      </tr>*/}
              {/*      <tr className={'extra-tr'}>*/}
              {/*          <th>*/}
              {/*              <label className='main-label' htmlFor=""><Trans>socialContribution</Trans></label>*/}
              {/*              <p className={'extra-label'}><Trans>socialContributionExtra</Trans></p>*/}
              {/*          </th>*/}
              {/*          <td>*/}
              {/*<textarea*/}
              {/*    className="table__text"*/}
              {/*    defaultValue={socialContribution}*/}
              {/*    name="socialContribution"*/}
              {/*    onChange={this.handleInputChange}*/}
              {/*/>*/}
              {/*          </td>*/}
              {/*      </tr>*/}
                    <Indicators indicators={this.state.indicators} program={this.props.program} handleIndicatorsChange={this.handleIndicatorsChange} />
                    <Plan plan={this.state.plan}  program={this.props.program} handlePlanChange={this.handlePlanChange} />
                    {/*<tr className={'extra-tr'}>*/}
                    {/*    <th>*/}
                    {/*        <label className='main-label' htmlFor=""><Trans>projectCoverage</Trans></label>*/}
                    {/*        <p className={'extra-label'}><Trans>projectCoverageExtra</Trans></p>*/}
                    {/*    </th>*/}
                    {/*    <td>*/}
                    {/*    <textarea*/}
                    {/*        className="table__text"*/}
                    {/*        defaultValue={projectCoverage}*/}
                    {/*        name="projectCoverage"*/}
                    {/*        onChange={this.handleInputChange}*/}
                    {/*    />*/}
                    {/*    </td>*/}
                    {/*</tr>*/}
                    </tbody>
                </table>
            </>
        )
    }
}

export default FieldEfficiencyAndResult;
