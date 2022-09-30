import { UserStore } from "./UserStore";
import { CompetitionsStore } from "./CompetitionsStore";
import { ApplicationsStore } from "./ApplicationsStore";
import { ApplicantsStore } from "./ApplicantsStore";
import { FilesStore } from "./FilesStore";
import { ContractsStore } from "./ContractsStore";
import { MessageStore } from "./MessageStore";
import { inject, IReactComponent, IWrappedComponent } from "mobx-react";

export class RootStore {
  userStore;
  todoStore;
  applicantsStore;
  competitionsStore;
  applicationsStore;
  filesStore;
  contractsStore;
  messageStore;
  static NAME = "appState";
  constructor() {
    this.userStore = new UserStore(this);
    this.applicantsStore = new ApplicantsStore(this);
    this.competitionsStore = new CompetitionsStore(this);
    this.applicationsStore = new ApplicationsStore(this);
    this.filesStore = new FilesStore(this);
    this.contractsStore = new ContractsStore(this);
    this.messageStore = new MessageStore(this);
  }
}
export interface AppStateObserver {
  appState?: RootStore;
}

export function injectAppState<T extends IReactComponent>(
  target: T
): T & IWrappedComponent<T> {
  return inject(RootStore.NAME)(target);
}
