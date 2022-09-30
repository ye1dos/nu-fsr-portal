import {enGB, kk, ru} from "date-fns/locale";

const localeChanger = (lang) => {
    console.log("locale");
    console.log(lang);
    switch (lang) {
        case "ru":
            return ru;
        case "kz":
            return kk;
        default:
            return enGB;
    }
}

export default localeChanger;