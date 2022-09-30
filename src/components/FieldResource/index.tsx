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
        budget: this.props.resource?.budget || null,
        application: this.props.app_id ? {id: this.props.app_id} : null,
    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.state[name] = value;
        this.props.handleResourceChange(this.state);
    }

    handleInputChangeMaterial = (event, index) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        const materialBase = this.state.materialBase;
        let form = materialBase[index];
        form[name] = value;
        materialBase[name] = form[name];
        this.setState({
            materialBase: materialBase,
        });
        this.props.handleResourceChange(this.state);
    };
    addMaterial = () => {
        let materialBaseForm = {
            purpose: '',
            name: '',
            number: Math.random() * 1000,
        }
        const newExperience = materialBaseForm;
        const materialBase = this.state.materialBase ? [...this.state.materialBase] : [];
        materialBase.push(newExperience);
        this.state.materialBase = materialBase;
        this.props.handleResourceChange(this.state);
    };
    deleteMaterial = (index) => {
        let materialBase = [...this.state.materialBase];
        if (materialBase.length > 0) materialBase.splice(index, 1);
        this.state.materialBase = materialBase;
        this.props.handleResourceChange(this.state);
    };
    handleInputChangeBudgetWithMask = (event, index) => {
        const target = event.target;
        const name = target.name;
        let budget = this.state.budget;
        let value = null;
        let numericAmount = null;
        let numericQuantity = null;
        let form = budget[index];
        if (name === 'amount') {
            numericAmount = Number(target.value.replace(/\s/g, ''));
            if (isNaN(numericAmount)) {
                numericAmount = 0;
            }
            value = numericAmount;
        }
        else if (name === 'quantity') {
            numericQuantity = Number(target.value.replace(/\s/g, ''));
            if (isNaN(numericQuantity)) {
                numericQuantity = 0;
            }
            value = numericQuantity;
        }
        form[name] = value;
        if (form.quantity && form.amount) {
            console.log(form.price, form.quantity, form.amount);
            if (typeof form.quantity === 'number') {
                numericQuantity = form.quantity;
            }
            else {
                numericQuantity = Number(form.quantity.replace(/\s/g, ''));
            }
            if (typeof form.quantity === 'number') {
                numericAmount = form.amount;
            }
            else {
                numericAmount = Number(form.amount.replace(/\s/g, ''));
            }
            form.price = numericQuantity * numericAmount;
        }
        else {
            form.price = null;
        }
        budget[name] = form[name];
        this.setState({
            budget: budget,
        });
        this.props.handleResourceChange(this.state);
    }
    handleInputChangeBudget = (event, index) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        const budget = this.state.budget;
        let form = budget[index];
        form[name] = value;
        budget[name] = form[name];
        this.state.budget = budget;
        this.props.handleResourceChange(this.state);
    };
    addBudget = () => {
        let budgetForm = {
            expenditureItem: '',
            amount: '',
            quantity: null,
            source: '',
            number: Math.random() * 1000,
            price: null
        }
        const newExperience = budgetForm;
        const budget = this.state.budget ? [...this.state.budget] : [];
        budget.push(newExperience);
        this.state.budget = budget;
        this.props.handleResourceChange(this.state);
    };
    deleteBudget = (index) => {
        let budget = [...this.state.budget];
        if (budget.length > 0) budget.splice(index, 1);
        this.state.budget = budget;
        this.props.handleResourceChange(this.state);
    };
    convertToNumber = (str) => {
        if (typeof str === 'number') return str;
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
        console.log(maskedArr);
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
            {/* Собственные средства */}
            {this.state.budget.length > 0 && (
                <div style={{display: 'flex'}}>
                    <p style={{paddingBottom: '10px'}}><Trans>sumUp1</Trans>: {this.convertToMasked(sum2)}</p>
                    <div style={{paddingLeft: '10px', color: '#f44336'}}>{checkLimits(sum2, prog)}</div>
                </div>
            )}
            {this.state.budget.length > 0 && (<p style={{paddingBottom: '10px'}}><Trans>sumUp2</Trans>: {this.convertToMasked(sum1)}</p>)}
            {this.state.budget.length > 0 && (<p style={{paddingBottom: '10px'}}><Trans>sumUp3</Trans>: {this.convertToMasked(sum3)}</p>)}
            {this.state.budget.length > 0 && (<p><Trans>sumUp</Trans>: {this.convertToMasked(sumAll)}</p>)}
        </>
    }
    render() {
        const {income, description, experience, partners, marketTest, funds, results} = this.state;
        const prog = this.props.program?.map((prog, idx) => {
            return prog.name
        });
        return (
            <>
                {(prog[0] === SI || prog[0] === SE || prog[0] === SG || prog[0] === IG) && (
                    <table className="talap-form" style={{width: '100%'}}>
                        <tbody>
                        {/*both*/}
                        <tr className={'extra-tr'}>
                            <th>
                                <label className={'main-label'} htmlFor=""><Trans>partners</Trans></label>
                                <p className={'extra-label'}><Trans>partnersExtra</Trans></p>
                            </th>
                            <td>
                            <textarea
                                className="table__text"
                                id={'extra__input'}
                                defaultValue={partners}
                                name="partners"
                                onChange={this.handleInputChange}
                            />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                )}
                <div style={{marginTop: '30px'}} className="application-table__body">
                    <p className='main-label' style={{marginBottom: '12px', marginTop: '24px'}}><Trans>budget</Trans></p>
                    <p style={{marginBottom: '12px'}} className={'extra-label'}><Trans>budgetExtras.SP</Trans></p>
                    {prog[0] === SI && <p className={'extra-label_budget mb-20'}><Trans>budgetNotRecommendedSI</Trans></p>}
                    {prog[0] === SE && <p className={'extra-label_budget mb-20'}><Trans>budgetNotRecommendedSE</Trans></p>}
                    <p className={'extra-label_budget mb-20'}><Trans>budgetNotRecommended</Trans></p>
                    <table className="application-table">{this.renderBudget()}</table>
                </div>
                <div className="add-expense__container" style={{padding: '17px 0px', display: 'flex', flexDirection: 'column'}}>
                    {this.state.budget && this.calculateSums(this.state.budget, prog)}
                </div>
                <div className="add-expense__container">
                    <button className="add-expense" onClick={this.addBudget} disabled={this.state.budget && this.state.budget.length >= 10}>
                        <Trans>Add</Trans>
                    </button>
                </div>
                {/* SI */}
                {prog[0] === SI && (
                    <table className="talap-form" style={{width: '100%'}}>
                        <tbody>
                        <tr className={'extra-tr'}>
                            <th>
                                <label className={'main-label'} htmlFor=""><Trans>marketTest</Trans></label>
                                <p className={'extra-label'}><Trans>marketTestExtra</Trans></p>
                            </th>
                            <td>
                                <textarea
                                    className="table__text"
                                    defaultValue={marketTest}
                                    name="marketTest"
                                    id={'extra__input'}
                                    onChange={this.handleInputChange}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                )}
                {/* !SP !PG */}
                {(prog[0] !== SP && prog[0] !== PG) && (
                    <>
                    <div className="application-table__body" style={{marginTop: '20px'}}>
                        <p style={{marginBottom: '12px', marginTop: '24px'}} className={'main-label'}>
                            <Trans>materialBase</Trans></p>
                        <p style={{marginBottom: '12px'}} className={'extra-label'}>
                            <Trans>materialBaseExtra</Trans></p>
                        <table className="application-table">{this.renderMaterialBase()}</table>
                    </div>
                    <div style={{paddingTop: '10px'}} className="add-expense__container">
                        <button className="add-expense" onClick={this.addMaterial}>
                            <Trans>Add</Trans>
                        </button>
                    </div>
                </>
                )}
                {/* SE SI */}
                {(prog[0] === SE || prog[0] === SI) && (
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
                                        <input
                                            type='number'
                                            className="general-info__input"
                                            defaultValue={income}
                                            name="income"
                                            id={'extra__input'}
                                            onChange={this.handleInputChange}
                                        />
                                    </td>
                                </tr>
                                <tr className={'extra-tr'}>
                                    <th>
                                        <label className={'main-label'} htmlFor=""><Trans>funds</Trans></label>
                                    </th>
                                    <td>
                                        <textarea
                                            className="table__text"
                                            defaultValue={funds}
                                            name="funds"
                                            id={'extra__input'}
                                            onChange={this.handleInputChange}
                                        />
                                    </td>
                                </tr>
                                <tr className={'extra-tr'}>
                                    <th>
                                        <label className={'main-label'} htmlFor=""><Trans>descriptionResource</Trans></label>
                                        <p className={'extra-label'}><Trans>descriptionResourceExtra</Trans></p>
                                    </th>
                                    <td>
                                        <textarea
                                            className="table__text"
                                            defaultValue={description}
                                            name="description"
                                            id={'extra__input'}
                                            onChange={this.handleInputChange}
                                        />
                                    </td>
                                </tr>
                            </>)
                        }
                        {/* SE */}
                        {prog[0] === SE && (
                            <tr className={'extra-tr'}>
                                <th>
                                    <label className={'main-label'} htmlFor=""><Trans>experience</Trans></label>
                                    <p className={'extra-label'}><Trans>experienceExtra</Trans></p>
                                </th>
                                <td>
                            <textarea
                                className="table__text"
                                defaultValue={experience}
                                name="experience"
                                id={'extra__input'}
                                onChange={this.handleInputChange}
                            />
                                </td>
                            </tr>)}
                        {/* both */}
                        {prog && (prog[0] === SI || prog[0] === SE) &&
                            <tr className={'extra-tr'}>
                            <th>
                                <label className={'main-label'} htmlFor=""><Trans>results</Trans></label>
                                {/*<p className={'extra-label'}><Trans>resultsExtra</Trans></p>*/}
                            </th>
                            <td>
                                <textarea
                                className="table__text"
                                defaultValue={results}
                                name="results"
                                id={'extra__input'}
                                onChange={this.handleInputChange}
                            />
                            </td>
                        </tr>
                        }
                        </tbody>
                    </table>
                )}
            </>
        )
    }
    renderMaterialBase() {
        const { materialBase } = this.state;
        return (
            <>
                <tr>
                    <th>
                        <Trans>nameMaterial</Trans>
                    </th>
                    <th>
                        <Trans>purpose</Trans>
                    </th>
                </tr>
                {materialBase && materialBase.map((mb, idx) => (
                    <tr >
                        <td>
                            <input
                                value={mb.name}
                                className="expense-plan__input"
                                type="text"
                                name="name"
                                onChange={(event) =>
                                    this.handleInputChangeMaterial(event, idx)
                                }
                            />
                        </td>
                        <td>
                            <input
                                value={mb.purpose}
                                className="expense-plan__input"
                                type="text"
                                name="purpose"
                                onChange={(event) =>
                                this.handleInputChangeMaterial(event, idx)
                                    }
                            />
                        </td>
                        <td className={'empty_td'}>
                            <img
                                src={deleteIcon}
                                alt=""
                                className="delete_table_row"
                                onClick={() => this.deleteMaterial(idx)}
                            />
                        </td>
                    </tr>
                ))}
            </>
        )
    }

    renderBudget() {
        const { budget } = this.state;
        const sources = ['Средства гранта Фонда', 'Собственные средства', 'Со-финансирование'];
        return (
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
                {budget && budget.map((bd, idx) => (
                    <tr key={idx}>
                        <td>
                            <input
                                value={bd.expenditureItem}
                                className="expense-plan__input"
                                type="text"
                                name="expenditureItem"
                                onChange={(event) =>
                                    this.handleInputChangeBudget(event, idx)
                                }
                            />
                        </td>
                        <td>
                            <input
                                value={(bd.amount && bd.amount.toLocaleString())}
                                className="expense-plan__input"
                                type="text"
                                name="amount"
                                onChange={(event) =>
                                    this.handleInputChangeBudgetWithMask(event, idx)
                                }
                            />
                        </td>
                        <td>
                        <input
                                value={(bd.quantity && bd.quantity.toLocaleString())}
                                className="expense-plan__input"
                                type="text"
                                name="quantity"
                                onChange={(event) =>
                                    this.handleInputChangeBudgetWithMask(event, idx)
                                }
                            />
                        </td>
                        <td>
                            <input
                                readOnly
                                value={(bd.price && bd.price.toLocaleString())}
                                className="expense-plan__input"
                                type="text"
                                name="price"
                                // onChange={(event) =>
                                //     this.handleInputChangeBudgetWithMask(event, idx)
                                // }
                            />
                        </td>
                        <td>
                            <select
                                value={bd.source}
                                name="source"
                                onChange={(event) => this.handleInputChangeBudget(event, idx)}
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
                            <img
                                src={deleteIcon}
                                alt=""
                                className="expense-delete"
                                onClick={() => this.deleteBudget(idx)}
                            />
                        </td>
                    </tr>))}
                    </tbody>
            </>
        )
    }

}

export default FieldResource;
