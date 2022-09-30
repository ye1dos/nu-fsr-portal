import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from  "react-datepicker";
import ru from 'date-fns/locale/ru';
import kk from 'date-fns/locale/kk';
import i18n from "../../i18n";
import moment from "moment";
registerLocale('ru', ru);
registerLocale('kz', kk);
const DatePickerMultiComponent = (props) => {
  const { selected } = props;
  const sel = selected ? selected.split('-') : [null, null];
  console.log(selected);
  const [dateRange, setDateRange] = useState([sel[0] && moment(sel[0], "DD.MM.yyyy").toDate(), sel[1] && moment(sel[1], "DD.MM.yyyy").toDate()]);
  const [startDate, endDate] = dateRange;
  const formatDate = (date) => {
    if (date) {
      let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
      console.log(day + '.' + month + '.' + year)
      return day + '.' + month + '.' + year;
    }
    return null;
  }
  const handleChange = (d) => {
    setDateRange(d);
    props.handleChangeDate(formatDate(d[0]) + '-' + formatDate(d[1]), props.idx);
  }
    return (
        <DatePicker
            locale={i18n.language ? i18n.language : 'ru'}
            className="expense-plan__input"
            dateFormat="dd.MM.yyyy"
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              handleChange(update);
            }}
            isClearable={true}
        />
      );
}
export default DatePickerMultiComponent;