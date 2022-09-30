import React from 'react';
import { Trans } from "react-i18next";
import {IG, SG} from "../../consts";
class FieldInnovativeness extends React.Component<any, any> {
    state = {
        innovation: this.props.innovativeness?.innovation || null,
        competitors: this.props.innovativeness?.competitors || null,
        advantages: this.props.innovativeness?.advantages || null,
        application: this.props.app_id ? { id: this.props.app_id} : null,
    }
    // should add applicant in innovativeness
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.state[name] = value;
        this.props.handleInnovativenessChange(this.state);
    }
    render () {
        const { innovation, competitors, advantages } = this.state;
        const prog = this.props.program?.map((prog, idx) => {
            return prog.name
        });
        return (
            <>
                <h1 className={'extra-h1'}><Trans>INNOV</Trans></h1>
                <table className="talap-form">
                    <tbody>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>innovation</Trans></label>
                            <p className={'extra-label'}><Trans>innovationExtra</Trans></p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={innovation}
                                name="innovation"
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>competitors</Trans></label>
                            <p className={'extra-label'}><Trans>competitorsExtra</Trans></p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={competitors}
                                name="competitors"
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>
                    {prog && (prog[0] !== SG && prog[0] !== IG) && (<tr className={'extra-tr'}>
                        <th>
                            <label className={'main-label'} htmlFor=""><Trans>advantages</Trans></label>
                            <p className={'extra-label'}><Trans>advantagesExtra</Trans></p>
                        </th>
                        <td>
                            <textarea
                                className="table__text"
                                defaultValue={advantages}
                                name="advantages"
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>
                    )}
                    </tbody>
                </table>
            </>
        )
    }
}
export default FieldInnovativeness;
