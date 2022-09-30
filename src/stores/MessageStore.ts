import { action, observable, toJS } from "mobx";
import { cubaREST } from "../cubaREST";
export class MessageStore {
  rootStore;
  @observable messages;
  @observable faqList;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  loadMessages = () => {
    cubaREST
      .searchEntities(
        "fsr_Message",
        {
          conditions: [
            {
              property: "messageTheme.applicant.email",
              operator: "startsWith",
              value: localStorage.getItem("applicant")
            }
          ]
        },
        { view: "message-portal" }
      )
      .then(
        action(res => {
          this.messages = res;
          this.messages = this.messages.sort(
            (a, b) =>
              new Date(a.createTs).getTime() - new Date(b.createTs).getTime()
          );

          setTimeout(() => {
            var objDiv = document.getElementById("messages__body");
            objDiv.scrollTop = objDiv.scrollHeight;
          }, 0);
        })
      );
  };
  sendMessage = form => {
    cubaREST.commitEntity("fsr_MessageTheme", form).then(
      action(res => {
        this.loadMessages();
      })
    );
  };

  loadFAQ = () => {
    cubaREST.loadEntities("fsr_Faq").then(
      action(res => {
        this.faqList = res;
        this.faqList.forEach(element => {
          element.show = false;
        });
        this.faqList = this.faqList.filter(element => element.visible);
      })
    );
  };
}
