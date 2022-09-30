import * as React from "react";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import { RouteComponentProps } from "react-router-dom";
import { Trans } from "react-i18next";

import Loader from "react-loader-spinner";
import faqUp from "../../assets/icons/faq-up.svg";
import faqDown from "../../assets/icons/faq-down.svg";
import "./FAQ.css";

export interface FAQProps {}

export interface FAQState {}
@injectAppState
@observer
class FAQ extends React.Component<
  AppStateObserver & RouteComponentProps,
  FAQProps,
  FAQState
> {
  componentDidMount() {
    this.props.appState.messageStore.loadFAQ();
  }

  showAnswer = (idx) => {
    const list = this.props.appState.messageStore.faqList;
    for (let i = 0; i < list.length; i++) {
      if (idx === i) {
        if (list[i].show) list[i].show = false;
        else list[i].show = true;
      } else {
        list[i].show = false;
      }
    }
  };

  constructor(props) {
    super(props);
  }
  render() {
    const { faqList } = this.props.appState.messageStore;
    const { language } = this.props.appState.userStore;
    if (faqList)
      return (
        <React.Fragment>
          <h1 className="faq__heading">
            <Trans>FAQ</Trans>
          </h1>
          <div className="faq__container">
            {faqList.map((faq, idx) => {
              return (
                <div
                  key={idx}
                  className="faq__item"
                  onClick={() => {
                    this.showAnswer(idx);
                  }}
                >
                  <div className="faq__question">
                    <p
                      dangerouslySetInnerHTML={this.createMarkup(faq.title)}
                    ></p>
                    {this.renderShowIcon(faq.show)}
                  </div>
                  {faq.show && (
                    <div
                      className="faq__answer"
                      dangerouslySetInnerHTML={this.createMarkup(
                        faq.description
                      )}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </React.Fragment>
      );
    return (
      <div className="loader-container">
        <Loader
          type="Triangle"
          color="#209898"
          height={200}
          width={200}
          timeout={15000}
        />
      </div>
    );
  }
  renderShowIcon = (show) => {
    if (show) return <img src={faqUp} alt="" />;
    else return <img src={faqDown} />;
  };

  createMarkup(markup) {
    return { __html: markup };
  }
}

export default FAQ;
