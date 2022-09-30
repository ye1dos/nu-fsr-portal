import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import getYear from "date-fns/getYear";
import getMonth from "date-fns/getMonth";
import range from "lodash/range";
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from  "react-datepicker";
import ru from 'date-fns/locale/ru';
import kk from 'date-fns/locale/kk';
import i18n from "../../i18n";
registerLocale('ru', ru);
registerLocale('kz', kk);
const DatePickerComponent = (props) => {
    const { type, selected } = props;
    const years = range(1950, getYear(new Date()));
    const [startDate, setStartDate] = useState(selected ? new Date(selected) : null);
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
    const handleChange = (d) => {
      setStartDate(d);
      if (type === "NONE") {
        props.handleChangeDate(d);
      }
      else if (type === "EXTRA") {
        props.handleChangeDateExtra(d);
      }
    }
    return (
        <DatePicker
            locale={i18n.language ? i18n.language : 'ru'}
          className="general-info__input"
          dateFormat="dd.MM.yyyy"
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            
            <div
              style={{
                margin: 10,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {console.log(getYear(date),(date.getMonth()),months[getMonth(date)])}
              <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                {"<"}
              </button>
              <select
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(value)}
              >
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
    
              <select
                value={months[date.getMonth()]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
              >
                {months.map((option) => (
                  <option key={option} value={option}>
                    {i18n.t("month." + option)}
                  </option>
                ))}
              </select>
    
              <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                {">"}
              </button>
            </div>
          )}
          selected={startDate}
          onChange={(date) => handleChange(date)}
        />
      );
}
export default DatePickerComponent;