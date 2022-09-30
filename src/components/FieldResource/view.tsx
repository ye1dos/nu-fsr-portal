import React from 'react';
import deleteIcon from "../../assets/icons/delete-icon.svg";
import {Trans} from "react-i18next";
import InputMask from "react-input-mask";
import i18next from "i18next";
import {toJS} from "mobx";
import {IG, PG, SE, SG, SI, SP} from "../../consts";
import checkLimits from "../../helpers/checkLimits";
class FieldResource extends React.Component<any, any> {
    state = {
        income: this.props.resource?.income || null,
        description: this.props.resource?.description || null,
        experience: this.props.resource?.experience || null,
        partners: this.props.resource?.partners || null,
        marketTest: this.props.resource?.marketTest || null,
        funds: this.props.resource?.funds || null,
        results: this.props.resource?.results || null,
        materialBase: this.props.resource?.materialBase || null,
        budget: this.props.resource?.budget || null
    }
    convertToNumber = (str) => {
        if (typeof str === 'number') {
            return str;
        }
        return str.replace(/^\s+|\s+|\s$/g, '') - 0;
    }
    convertToMasked = (num) => {
        const arr = num.toString().split('').reverse();
        const maskedArr = [];
        console.log(arr);
        if (arr.length > 3) {
            for (let i = 0; i < arr.length; i++ ) {
                if (i % 3 === 0) {
                    maskedArr.push(arr[i] + ' ');
                    continue;
                }
                maskedArr.push(arr[i]);
            }
        }
        else {
            return num.toString();
        }
        return maskedArr.reverse().join('');
    }
    calculateSums = (budget, prog) => {
        let sum1 = budget.reduce((acc, el) => {
            if (el.price && el.source === 'Собственные средства') {
                return acc + this.convertToNumber(el.price);
            }
            return acc;
        }, 0);
        let sum2 = budget.reduce((acc, el) => {
            if (el.price && el.source === 'Средства гранта Фонда') {
                return acc + this.convertToNumber(el.price);
            }
            return acc;
        }, 0);
        let sum3 = budget.reduce((acc, el) => {
            if (el.price && el.source === 'Со-финансирование') {
                return acc + this.convertToNumber(el.price);
            }
            return acc;
        }, 0);
        let sumAll = this.state.budget.reduce((acc, el) => {
            if (el.price) {
                return acc + this.convertToNumber(el.price);
            }
            return acc;
        }, 0);
        return <>
            {this.state.budget.length > 0 && (<p style={{paddingBottom: '10px'}}><Trans>sumUp1</Trans>: {this.convertToMasked(sum2)}</p>)}
            {this.state.budget.length > 0 && (<p style={{paddingBottom: '10px'}}><Trans>sumUp2</Trans>: {this.convertToMasked(sum1)}</p>)}
            {this.state.budget.length > 0 && (<p style={{paddingBottom: '10px'}}><Trans>sumUp3</Trans>: {this.convertToMasked(sum3)}</p>)}
            {this.state.budget.length > 0 && (<p><Trans>sumUp</Trans>: {this.convertToMasked(sumAll)}</p>)}
            {this.state.budget.length > 0 && <div style={{paddingTop: '10px', color: '#f44336'}}>{checkLimits(sum2, prog)}</div>}
        </>
    }
    render() {
        const {income, description, experience, partners, marketTest, funds, results} = this.state;
        const prog = this.props.program?.map((prog, idx) => {
            return prog.name
        });
        return (
            <>
                <div style={{marginTop: '30px'}} className="application-table__body">
                    <p className='main-label' style={{marginBottom: '12px', marginTop: '24px'}}><Trans>budget</Trans></p>
                    <p style={{marginBottom: '12px'}} className={'extra-label'}>
                        {prog[0] === SP && <Trans>budgetExtras.SP</Trans>}
                        {prog[0] === SG && <Trans>budgetExtras.SG</Trans>}
                        {prog[0] === PG && <Trans>budgetExtras.PG</Trans>}
                        {prog[0] === IG && <Trans>budgetExtras.IG</Trans>}
                    </p>
                    {prog[0] === SI && <p className={'extra-label_budget mb-20'}><Trans>budgetNotRecommendedSI</Trans></p>}
                    {prog[0] === SE && <p className={'extra-label_budget mb-20'}><Trans>budgetNotRecommendedSE</Trans></p>}
                    <p className={'extra-label_budget mb-20'}><Trans>budgetNotRecommended</Trans></p>
                    <table className="application-table">{this.renderBudget()}</table>
                </div>
                <div className="add-expense__container" style={{padding: '17px 0px', display: 'flex', flexDirection: 'column'}}>
                    {this.state.budget && this.calculateSums(this.state.budget, prog)}
                </div>
                {/* SE SI */}
                {prog && (prog[0] === SI || prog[0] === SE || prog[0] === SG || prog[0] === IG) && (
                    <>
                    <table className="talap-form" style={{width: '100%'}}>
                        <tbody>
                        {/*both*/}
                        <tr className={'extra-tr'}>
                            <th>
                                <label className={'main-label'} htmlFor=""><Trans>partners</Trans></label>
                                <p className={'extra-label'}><Trans>partnersExtra</Trans></p>
                            </th>
                            <td>
                                <input value={partners} readOnly className="general-info__input"/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </>
                )}
                {prog && prog[0] === SI && (
                    <table className="talap-form" style={{width: '100%'}}>
                        <tbody>
                        <tr className={'extra-tr'}>
                            <th>
                                <label className={'main-label'} htmlFor=""><Trans>marketTest</Trans></label>
                                <p className={'extra-label'}><Trans>marketTestExtra</Trans></p>
                            </th>
                            <td>
                                <input value={marketTest} readOnly className="general-info__input"/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                )}
                {/* SE SI */}
                {prog && (prog[0] !== SP && prog[0] !== PG) && (
                    <>
                    <div className="application-table__body" style={{marginTop: '20px'}}>
                        <p style={{marginBottom: '12px', marginTop: '24px'}} className={'main-label'}>
                            <Trans>materialBase</Trans>
                        </p>
                        <p style={{marginBottom: '12px'}} className={'extra-label'}>
                            <Trans>materialBaseExtra</Trans>
                        </p>
                        <div>{this.renderMaterialBase()}</div>
                    </div>
                    <table className="talap-form">
                        <tbody>
                        {/* SI */}
                        {prog[0] === SI && (
                            <>
                                <tr className={'extra-tr'}>
                                    <th>
                                        <label className={'main-label'} htmlFor=""><Trans>incomeR</Trans></label>
                                        <p className={'extra-label'}><Trans>incomeRExtra</Trans></p>
                                    </th>
                                    <td>
                                        <input value={income} readOnly className="general-info__input"/>
                                    </td>
                                </tr>
                                <tr className={'extra-tr'}>
                                    <th>
                                        <label className={'main-label'} htmlFor=""><Trans>funds</Trans></label>
                                    </th>
                                    <td>
                                        <input value={funds} readOnly className="general-info__input"/>
                                    </td>
                                </tr>
                                <tr className={'extra-tr'}>
                                    <th>
                                        <label className={'main-label'} htmlFor=""><Trans>descriptionResource</Trans></label>
                                        <p className={'extra-label'}><Trans>descriptionResourceExtra</Trans></p>
                                    </th>
                                    <td>
                                        <input value={description} readOnly className="general-info__input"/>
                                    </td>
                                </tr>
                            </>
                            )
                        }
                        {/* SE */}
                        {prog[0] === SE && (
                            <tr className={'extra-tr'}>
                                <th>
                                    <label className={'main-label'} htmlFor=""><Trans>experience</Trans></label>
                                    <p className={'extra-label'}><Trans>experienceExtra</Trans></p>
                                </th>
                                <td>
                                    <input value={experience} readOnly className="general-info__input"/>
                                </td>
                            </tr>)}
                        {/* both */}
                        {prog && (prog[0] === SI || prog[0] === SE) && <tr className={'extra-tr'}>
                            <th>
                                <label className={'main-label'} htmlFor=""><Trans>results</Trans></label>
                            </th>
                            <td>
                                <input value={results} readOnly className="general-info__input"/>
                            </td>
                        </tr>}
                        </tbody>
                    </table>
                    </>
                )}
            </>
        )
    }
    renderMaterialBase() {
        const { materialBase } = this.state;
        return (
            <>
                {materialBase && materialBase.map((mb, idx) => (
                    <table className="application-table mt-30" key={idx}>
                        <tr>
                            <th className={'vertical_table_th'}>
                                <Trans>nameMaterial</Trans>
                            </th>
                            <td>
                                <label>{mb.name}</label>
                            </td>
                        </tr>
                        <tr>
                            <th className={'vertical_table_th'}>
                                <Trans>purpose</Trans>
                            </th>
                            <td>
                                <label>{mb.purpose}</label>
                            </td>
                        </tr>
                    </table>
                ))}
            </>
        )
    }

    renderBudget() {
        const { budget } = this.state;
        const sources = ['Средства гранта Фонда', 'Собственные средства', 'Со-финансирование'];        return (
            <>
                <thead>
                <tr>
                    <th>
                        <Trans>expenditureItem</Trans>
                    </th>
                    <th style={{minWidth: "200px"}}>
                        <Trans>amount</Trans>
                    </th>
                    <th style={{minWidth: "170px"}}>
                        <Trans>quantity</Trans>
                    </th>
                    <th style={{minWidth: "170px"}}>
                        <Trans>price</Trans>
                    </th>
                    <th style={{minWidth: "230px", whiteSpace: "normal"}}>
                        <Trans>source</Trans>
                    </th>
                </tr>
                </thead>
                <tbody>
                {console.log(budget)}
                {budget && budget.map((bd, idx) => (
                    <tr key={idx}>
                        <td>
                            <label>{bd.expenditureItem}</label>
                        </td>
                        <td>
                            <label>{bd.amount}</label>
                        </td>
                        <td>
                            <label>{bd.quantity}</label>
                        </td>
                        <td>
                            <label>{bd.price}</label>
                        </td>
                        <td>
                            <select
                                value={bd.source}
                                name="source"
                                className="general-info__input__select"
                            >
                                <option value="" selected disabled hidden>{i18next.t('choose')}</option>
                                {sources.map((source, idx) => {
                                    return (
                                        <option key={idx} value={source}>
                                            {i18next.t(source)}
                                        </option>
                                    );
                                })}
                            </select>
                        </td>
                    </tr>))}
                    </tbody>
            </>
        )
    }

}

export default FieldResource;