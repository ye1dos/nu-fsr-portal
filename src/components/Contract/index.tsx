import * as React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { enGB, eo, ru } from "date-fns/locale";
import { toJS } from "mobx";

export interface ContractProps {
  contract: any;
}

export interface ContractState {}

class Contract extends React.Component<ContractProps, ContractState> {
  state = {
    statuses: {
      NEW: "Новый",
      COLLECTION_OF_APPLICATION: "Сбор заявок",
      VOTING: "Голосование",
      UNDER_CONSIDERATION: "На рассмотрении",
      INTERVIEW: "Интервью",
      FINAL_REVIEW: "Рассмотрение председателем",
      COLLECTION_OF_AGREEMENTS: "Сбор соглашений",
      COMPLETED: "Завершен"
    }
  };
  render() {
    const { contract } = this.props;
    console.log(toJS(contract));
    return (
      <div className="competition__panel">
        <h3 className="competition__name">{contract._instanceName}</h3>
        <p className="competition__short-desc">Краткое описание договора</p>
        <div className="competition__info">
          <div>
            <p className="competition__info__header">Дата подписания</p>
            <p className="competition__info__value">
              {contract.changeDate
                ? format(Date.parse(contract.changeDate), "dd MMMM u", {
                    locale: ru
                  })
                : "Не назначена"}
            </p>
            {/* <p className="competition__info__value">в 14:55</p> */}
          </div>
          {/* <div>
            <p className="competition__info__header">Тип конкурса</p>
            <p className="competition__info__value">
              {contract.competition._instanceName}
            </p>
          </div> */}
          <div>
            <p className="competition__info__header">Статус</p>
            <p className="competition__info__value">{contract.status}</p>
          </div>
          <div>
            <p className="competition__info__header">Срок</p>
            <p className="competition__info__value">{contract.term} месяцев</p>
          </div>
        </div>
        <div className="competition__footer">
          <Link className="apply-button" to={`/contract/${contract.id}`}>
            Подробнее
          </Link>
        </div>
      </div>
    );
  }
}

export default Contract;
