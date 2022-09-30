import * as React from "react";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import { format } from "date-fns";
import { enGB, ru } from "date-fns/locale";
import { Trans } from "react-i18next";
import i18next from "i18next";
import sendMessageIcon from "../../assets/icons/send-message-icon.svg";
import "./Messages.css";
import localeChanger from "../../helpers/localeChanger";

export interface MessagesProps {}

export interface MessagesState {}

@injectAppState
@observer
class Messages extends React.Component<
  AppStateObserver,
  MessagesProps,
  MessagesState
> {
  constructor(props) {
    super(props);
    this.textArea = React.createRef();
  }

  textArea;

  state = {
    message: "",
  };
  componentDidMount() {
    this.props.appState.messageStore.loadMessages();
    this.focus();
  }

  focus = () => {
    this.textArea.current.focus();
  };
  handleChange = (event) => {
    this.setState({ message: event.target.value });
  };

  sendMessage = () => {
    if (this.state.message !== "") {
      this.props.appState.messageStore.sendMessage({
        applicant: {
          id: this.props.appState.applicantsStore.applicant.id,
        },
        initiator: "APPLICANT",
        messages: [
          {
            messageText: this.state.message,
            isReplied: "false",
            isRead: "false",
            isIncoming: "true",
          },
        ],
      });
      this.setState({ message: "" });
      setTimeout(() => {
        var objDiv = document.getElementById("messages__body");
        objDiv.scrollTop = objDiv.scrollHeight;
      }, 0);
    }
  };
  render() {
    const { messages } = this.props.appState.messageStore;
    return (
      <div className="messages__container">
        <div className="messages__body" id="messages__body">
          {this.renderMessages(messages)}
        </div>
        <div className="messages__footer">
          <textarea
            className="messages__text"
            placeholder={i18next.t("EnterMessage")}
            value={this.state.message}
            onChange={this.handleChange}
            ref={this.textArea}
          ></textarea>
          <button
            className="messages__button"
            onClick={() => this.sendMessage()}
          >
            <img src={sendMessageIcon} alt="" style={{ marginRight: "13px" }} />
            <Trans>Send</Trans>
          </button>
        </div>
      </div>
    );
  }
  renderMessages(messages) {
    const { language } = this.props.appState.userStore;
    const localeDate = localeChanger(language);
    if (messages) {
      return messages.map((message, idx) => {
        if (message.messageTheme.initiator === "APPLICANT") {
          return (
            <div className="message" key={idx}>
              <div className="message__header">
                <div className="message__header_left">
                  <div className="message__avatar">
                    {message.messageTheme.applicant.firstname.slice(0, 1)}
                  </div>
                  <p className="message__responsible">
                    {message.messageTheme.applicant.firstname}{" "}
                    {message.messageTheme.applicant.lastname}
                  </p>
                </div>

                <p className="message__time">
                  {message.createTs
                    ? format(Date.parse(message.createTs), "dd MMMM u H:mm", {
                        locale: localeDate,
                      })
                    : ""}
                </p>
              </div>
              <div className="message__body">{message.messageText}</div>
            </div>
          );
        } else if (message.messageTheme.initiator === "MANAGER") {
          return (
            <div className="message from-manager" key={idx}>
              <div className="message__header">
                <div className="message__header_left">
                  <div className="message__avatar_fsr"></div>
                  <p className="message__fsr">ФСР</p>
                  <p className="message__manager">
                    Курирующий менеджер {message.responsible.name}
                  </p>
                </div>

                <p className="message__time">
                  {message.createTs
                    ? format(Date.parse(message.createTs), "dd MMMM u H:mm", {
                        locale: localeDate,
                      })
                    : ""}
                </p>
              </div>
              <div
                className="message__body_fsr"
                dangerouslySetInnerHTML={this.createMarkup(message.messageText)}
              ></div>
            </div>
          );
        }
      });
    }
  }
  createMarkup(markup) {
    return { __html: markup };
  }
}

export default Messages;
