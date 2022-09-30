import {
  action,
  reaction,
  computed,
  observable,
  runInAction,
  toJS,
} from "mobx";
import { cubaREST } from "../cubaREST";
import { toast } from "react-toastify";
import i18next from "i18next";

export class EditContractPart {
  static ENTITY_NAME = "fsr_Contract";
  static VIEW = "contract-edit-view";
}

export class ContractsStore {
  rootStore;
  @observable contract;
  @observable contracts;
  @observable count;
  @observable offset = 0;
  @observable isLoadingList = false;
  @observable isLoadingContract = false;
  @observable expenseRegister;
  @observable expenseItems = [];
  @observable currencies = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.getExpenseItems();
    this.getCurrencies();
  }

  @computed
  private get loadOptions() {
    return {
      offset: this.offset,
      view: "contract-edit-view",
      sort: "-updateTs",
      dynamicAttributes: true,
      returnNulls: true,
    };
  }

  @action
  loadEntities = () => {
    this.isLoadingList = true;

    cubaREST
      .searchEntitiesWithCount(
        "fsr_Contract",
        {
          conditions: [
            {
              property: "applicant.email",
              operator: "startsWith",
              value: this.rootStore.userStore.userInfo.email,
            },
          ],
        },
        this.loadOptions
      )
      .then((resp) => {
        runInAction(() => {
          this.count = resp.count;
          this.contracts = resp.result;
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

  loadEntity = (id?: string) => {
    this.contract = null;
    if (id == null) {
      return;
    }
    this.isLoadingContract = true;
    cubaREST
      .loadEntity("fsr_Contract", id, { view: EditContractPart.VIEW })
      .then(
        action((e) => {
          this.contract = e;
          this.isLoadingContract = false;
        })
      )
      .catch(
        action((err) => {
          this.isLoadingContract = false;
        })
      );
  };

  loadExpenseRegister = (contractId) => {
    console.log("contractId " + contractId);
    cubaREST
      .searchEntities(
        "fsr_ExpenseRegister",
        {
          conditions: [
            {
              property: "contract.id",
              operator: "=",
              value: contractId,
            },
          ],
        },
        { view: "expenseRegister-view" }
      )
      .then(
        action((resp) => {
          console.log("Факты расходов");
          console.log(toJS(resp));
          this.expenseRegister = resp;
          for (let i = 0; i < this.expenseRegister.length; i++) {
            for (let j = 0; j < this.expenseItems.length; j++) {
              if (
                this.expenseRegister[i].expenseItem.name ===
                this.expenseItems[j].name
              ) {
                this.expenseRegister[i].itemName = this.expenseItems[j].name;
                break;
              }
            }
            for (let k = 0; k < this.currencies.length; k++) {
              if (
                this.expenseRegister[i].currency.name ===
                this.currencies[k].name
              ) {
                this.expenseRegister[i].currencyName = this.currencies[k].name;
                break;
              }
            }
          }
        })
      );
  };

  @action
  updateContract(contract) {
    cubaREST
      .commitEntity("fsr_Contract", contract)
      .then(
        action((res) => {
          console.log(res);
          toast.success(i18next.t("Success"), {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        })
      )
      .catch((error) => {
        console.log(error);
        toast.error(i18next.t("Error"), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      });
  }

  @action
  updateExpenseRegister(expenseRegister) {
    return cubaREST.commitEntity("fsr_ExpenseRegister", expenseRegister);
  }

  @action
  updateRegisterExpenseBill(bill) {
    return cubaREST.commitEntity("fsr_RegisterExpenseBill", bill);
  }

  @action
  deleteExpenseRegister(expenseRegister) {
    return cubaREST.deleteEntity("fsr_ExpenseRegister", expenseRegister);
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

  @computed
  get initializing(): boolean {
    return this.count == null && this.isLoadingList;
  }
}
