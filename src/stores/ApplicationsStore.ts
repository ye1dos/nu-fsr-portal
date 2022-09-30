import {
  action,
  computed,
  observable,
  runInAction,
  toJS,
} from "mobx";
import { cubaREST } from "../cubaREST";
import { toast } from "react-toastify";
import i18next from "i18next";
export class BrowseApplicationPart {
  static ENTITY_NAME = "fsr_Application";
  static VIEW = "application-browse-view";
}

export class EditApplicationPart {
  static ENTITY_NAME = "fsr_Application";
  static VIEW = "application-edit-view";
}

export class ApplicationsStore {
  rootStore;
  @observable isLoadingList = false;
  @observable offset = 0;
  @observable count: number;
  @observable applicationList = [];
  @observable myApplicationsList = [];

  @observable isLoadingApplication = false;
  @observable application;
  @observable isCommittingEntity = false;
  @observable expenseItems = [];
  @observable currencies = [];
  @observable experiences = [];
  @observable states = [];
  @observable directions = [];
  @observable applicationSaved = false;
  @observable isApplicationSaving = false;
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.getExpenseItems();
    this.getCurrencies();
    this.getStates();
  }

  @computed
  private get loadOptions() {
    return {
      offset: this.offset,
      view: BrowseApplicationPart.VIEW,
      sort: "-updateTs",
    };
  }

  @action
  createEntity(): void {
    this.application = new EditApplicationPart();
    this.application.applicant = "applicant";
    this.application.competition = "competition";
    setTimeout(() => {
      this.application.applicant = this.rootStore.applicantsStore.applicant;
      this.application.competition = this.rootStore.competitionsStore.competition;
    }, 2000);
  }

  @action
  loadEntities = () => {
    this.isLoadingList = true;
    let email = this.rootStore.userStore.userInfo
      ? this.rootStore.userStore.userInfo.email
      : localStorage.getItem("applicant");
    cubaREST
      .searchEntitiesWithCount(
        "fsr_Application",
        {
          conditions: [
            {
              property: "applicant.email",
              operator: "startsWith",
              value: email,
            },
          ],
        },
        this.loadOptions
      )
      .then((resp) => {
        runInAction(() => {
          this.count = resp.count;
          this.applicationList = resp.result;
          this.isLoadingList = false;
        });
      })
      .catch(
        action((err) => {
          this.isLoadingList = false;
          console.log(err);
        })
      );
  };

  @action
  loadEntity = (id?: string) => {
    this.application = null;
    if (id == null) {
      return;
    }
    this.isLoadingApplication = true;
    cubaREST
      .loadEntity("fsr_Application", id, { view: EditApplicationPart.VIEW })
      .then(
        action((e) => {
          this.application = e;
          for (let k = 0; k < this.application.expense.length; k++) {
            for (let l = 0; l < this.expenseItems.length; l++) {
              if (
                this.application.expense[k].item.name ===
                this.expenseItems[l].name
              ) {
                this.application.expense[k].itemName =
                  this.expenseItems[l].name;
                break;
              }
            }
            for (let m = 0; m < this.currencies.length; m++) {
              if (
                this.application.expense[k].currency.name ===
                this.currencies[m].name
              ) {
                this.application.expense[k].currencyName =
                  this.currencies[m].name;
                break;
              }
            }
          }
          for (let i = 0; i < this.states.length; i++) {
            if (this.application.state.id === this.states[i].id) {
              this.application.stateId = this.states[i].id;
              break;
            }
          }
          this.isLoadingApplication = false;
        })
      )
      .catch(
        action(() => {
          this.isLoadingApplication = false;
        })
      );
  };

  @action
  loadEntity2 = (id) => {
    return cubaREST.loadEntity("fsr_Application", id, { view: EditApplicationPart.VIEW })
  }
  @action
  getExpenseItems = () => {
    cubaREST
      .loadEntities("fsr_ExpenseItem")
      .then(
        action((res) => {
          this.expenseItems = res;
        })
      )
      .catch(
        action((exp) => {
          console.log("ExpenseItems are empty");
        })
      );
  };

  @action
  getCurrencies = () => {
    cubaREST
      .loadEntities("fsr_Currency")
      .then(
        action((res) => {
          this.currencies = res;
        })
      )
      .catch(
        action((exp) => {
          console.log("currencies are empty");
        })
      );
  };

  @action
  getStates = () => {
    cubaREST
      .loadEntities("fsr_RefState")
      .then(
        action((res) => {
          this.states = res;
        })
      )
      .catch(
        action((exp) => {
          console.log("states are empty");
        })
      );
  };

  // @action
  // getDirections = () => {
  //   cubaREST
  //     .loadEntities("fsr_DirectionType")
  //     .then(
  //       action((res) => {
  //         this.directions = res;
  //         console.log(toJS(this.directions));
  //       })
  //     )
  //     .catch((err) => {
  //       console.log("directions are empty");
  //     });
  // };
  @action
  getDirections2 = () => {
    return cubaREST.loadEntities("fsr_DirectionType");
  };
  @action
  getExpenseItems2 = () => {
    return cubaREST.loadEntities("fsr_ExpenseItem");
  };
  @action
  getCurrencies2 = () => {
    return cubaREST.loadEntities("fsr_Currency");
  };
  @action
  getStates2 = () => {
    return cubaREST.loadEntities("fsr_RefState");
  }

  @action
  populatorFrontVisible = (appliction_id) => {
    return cubaREST
    .invokeService(
      "fsr_ApplicationService",
      "populatorFrontVisible",
      {applicationId : appliction_id})
  }
  @action
  updateEntity(application, esp?, password?) {
    // updateEntity(application): Promise<any> {
    this.isCommittingEntity = true;
    // let replaced_esp = esp.replace("data:application/x-pkcs12;base64,", "");

    return cubaREST
      .invokeService("fsr_ApplicationService", "saveApplicationAndStartProcess", {
        application: application,
        // password: password,
        // certificateStore: replaced_esp,
      })
      .then((res) => {
        this.isCommittingEntity = false;
        this.loadEntities();
        let result = res as string;
        let status = JSON.parse(result).status;
        let message = JSON.parse(result).message
          ? JSON.parse(result).message
          : i18next.t("Error");
        if (status === "SUCCESS") {
          toast.success(i18next.t("Success"), {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (status === "ERROR") {
          toast.error(message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else if (status === "WARNING") {
          toast.error(message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      })
      .catch(
        action((e) => {
          this.isCommittingEntity = false;
          toast.error("Возникла ошибка", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          throw e;
        })
      );
  }

  @action
  updateEntityService(application, esp?, password?, comment?, outcome?, procId?) {
    let replaced_esp = esp.replace("data:application/x-pkcs12;base64,", "");
    return cubaREST.invokeService(
      "fsr_ApplicationService",
      "saveApplicationExpenses",
      {
        application: application,
        password: password,
        outcome: outcome,
        certificateStore: replaced_esp,
      }
    );
  }

  @action
  updateExpense(expense): Promise<any> {
    return cubaREST.commitEntity("fsr_Expense", expense);
  }
  @action
  sendApplication(application, esp?, password?): any {
    // let replaced_esp = esp.replace("data:application/x-pkcs12;base64,", "");
    console.log(application)
    // return cubaREST.invokeService(
    //   "fsr_ApplicationService",
    //   "runApplicationProcInstance",
    //   {
    //     application: application,
    //     // password: password,
    //     // certificateStore: replaced_esp,
    //   }
    // );
  }

  @action
  loadEntitiesService = (em) => {
    console.log(em);
    let email = em ? em : localStorage.getItem("applicant");
    return cubaREST.searchEntities("fsr_Application", {
      conditions: [
        {
          property: "applicant.email",
          operator: "startsWith",
          value: email,
        },
      ],
    });
  };

  @action
  loadEntitiesService_forExperience = (id) => {
    let email = this.rootStore.userStore.userInfo
      ? this.rootStore.userStore.userInfo.email
      : localStorage.getItem("applicant");

    // let id = this.rootStore.competitionsStore.competition.id;
    console.log(email);
    console.log(id);
    return cubaREST.searchEntities("fsr_Application", {
      conditions: [
        {
          property: "applicant.email",
          operator: "startsWith",
          value: email,
        },
        {
          property: "competition.id",
          operator: "=",
          value: id,
        },
      ],
    });
  };

  @action
  sendExperiences = (experiences) => {
    cubaREST
      .commitEntity("fsr_TeamMember", experiences)
      .then(
        action((res) => {
          console.log("exp is submitted");
        })
      )
      .catch(
        action((exp) => {
          console.log("fsr_TeamMember is not submitted");
        })
      );
  };
  @action
  getExperiences = (id?) => {
    return cubaREST.searchEntities("fsr_TeamMember", {
      conditions: [
        {
          property: "application.id",
          operator: "=",
          value: id,
        },
      ],
    });
  };

  @action
  getStarsForApplication = (application_id) => {
    return cubaREST.searchEntities("fsr_ApplicationStar", {
      conditions: [
        {
          property: "application.id",
          operator: "=",
          value: application_id,
        },
      ],
    });
  };
  // Jas Process
  @action
  StartProcess = (competitionId?, applicantId?) => {
    let obj = {
      competitionId: competitionId,
      applicantId: applicantId
    }
    return cubaREST.invokeService("fsr_ApplicationService", "saveApplicationAndStartProcess", obj)
  }

  @action
  approveApplication(application?, esp?, password?, comment?, outcome?, procTaskId?): Promise<any> {
    // console.log(application.competition);
    let replaced_esp = esp.replace("data:application/x-pkcs12;base64,", "");
    return cubaREST.invokeService(
      "fsr_BpmService",
      "completeUserTask",
      {
        application: application,
        password: password,
        certificateStore: replaced_esp,
        comment: comment,
        outcome: outcome,
        procTaskId: procTaskId
      }
    );
  }
}
