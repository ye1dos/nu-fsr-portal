import i18next from "i18next";
import { toast } from "react-toastify";

const wrongText = (text) => {
    toast.error(i18next.t(text), {
        autoClose: false,
        position: toast.POSITION.BOTTOM_CENTER,
    });
}
export default wrongText;