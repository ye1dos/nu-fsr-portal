import { toast } from "react-toastify";
import i18next from "i18next";
const toastErrorWithTranslation = (text) => {
    return toast.error(i18next.t(text), {
        autoClose: false,
        position: toast.POSITION.BOTTOM_CENTER,
    });
}

const toastError = (text) => {
    return toast.error(text, {
        autoClose: false,
        position: toast.POSITION.BOTTOM_CENTER,
    });
}

const toastSuccess = (text) => {
    return toast.success(text, {
        autoClose: false,
        position: toast.POSITION.BOTTOM_CENTER,
    });
}
export default { toastErrorWithTranslation, toastError, toastSuccess };
