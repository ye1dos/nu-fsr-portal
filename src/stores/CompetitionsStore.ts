import {
  action,
  reaction,
  computed,
  observable,
  runInAction,
  toJS,
} from "mobx";
import { differenceInCalendarDays } from "date-fns";
import { cubaREST } from "../cubaREST";

export class EditCompetitionPart {
  static ENTITY_NAME = "fsr_Competition";
  static VIEW = "competition-editor-view";
}

export class CompetitionsStore {
  rootStore;
  @observable competition;
  @observable competitions;
  @observable activeCompetitions;
  @observable archivedCompetitions;
  @observable reviewCompetitions;
  @observable createdApplications;
  @observable count;
  @observable offset = 0;
  @observable isLoadingList = false;
  @observable isLoadingCompetition = false;
  @observable compPrograms = [];
  @observable activeStatuses = ["COLLECTION_OF_APPLICATION"];
  @observable reviewStatuses = ["REVIEW"];
  @observable archivedStatuses = ["COMPLETED"];
  @observable competitionTypes;
  @observable notFound = false;
  @observable details = null;
  @observable anketaOk = null;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @computed
  private get loadOptions() {
    return {
      offset: this.offset,
      view: "competition-browser-view",
      sort: "-updateTs",
      dynamicAttributes: true,
      returnNulls: true,
    };
  }

  @action
  loadCompetitions = async () => {
    let userInfo = await this.rootStore.userStore.getUserInfo2();
    
    this.isLoadingList = true;
    cubaREST.invokeService("fsr_CompetitionService", "competitionsByUserId", { userId: userInfo.id})
    .then((resp : any) => {
      runInAction(() => {
        // array
        // console.log(resp);
        if ( JSON.parse(resp).status === "ERROR" ) {
          console.log("DB is updating");
          return new Error("DB is updating");
        }
        this.anketaOk = JSON.parse(resp).anketaOk;
        this.competitions = JSON.parse(resp).competitions;
        for(let i = 0; i < this.competitions.length; i++) {
          this.competitions[i] = Object.values(this.competitions[i])[0]
        }

        this.competitions = this.competitions.filter((comps) => {
          return comps.publishOnline;
        });
        this.archivedCompetitions = this.competitions.filter((comps) => {
          return this.archivedStatuses.includes(comps.status);
        });
        this.competitions = this.competitions.filter((comps) => {
          return differenceInCalendarDays(new Date(comps.dateEndRegistration), new Date()) >= 0;
        });
        
        this.createdApplications = this.competitions.filter((comps) => {
          return comps.applicationId;
        });
        this.createdApplications = this.createdApplications.filter((comps) => {
          return this.activeStatuses.includes(comps.status) || this.reviewStatuses.includes(comps.status);
        });
        this.activeCompetitions = this.competitions.filter((comps) => {
          return !comps.applicationId; 
        });
        this.activeCompetitions = this.activeCompetitions.filter((comps) => {
          return this.activeStatuses.includes(comps.status);
        });

        this.isLoadingList = false;
      });
    })
  }
  
  // @action
  // loadEntities = () => {
  //   this.isLoadingList = true;
  //   cubaREST
  //     .loadEntitiesWithCount("fsr_Competition", this.loadOptions)
  //     .then((resp) => {
  //       runInAction(() => {
  //         this.count = resp.count;
  //         this.competitions = resp.result;
  //         this.competitions = this.competitions.filter((comp) => {
  //           return comp.publishOnline;
  //         });

  //         this.activeCompetitions = this.competitions.filter((comp) => {
  //           return this.activeStatuses.includes(comp.status);
  //         });

  //         this.archivedCompetitions = this.competitions.filter((comp) => {
  //           return this.archivedStatuses.includes(comp.status);
  //         });

  //         this.reviewCompetitions = this.competitions.filter((comp) => {
  //           return this.reviewStatuses.includes(comp.status);
  //         });

  //         this.isLoadingList = false;
  //       });
  //     })
  //     .catch(
  //       action((err) => {
  //         this.isLoadingList = false;
  //       })
  //     );
  // };

  loadEntity = (id?: string) => {
    this.competition = null;
    this.notFound = false;
    if (id == null) {
      return;
    }
    this.isLoadingCompetition = true;
    cubaREST
      .loadEntity("fsr_Competition", id, { view: EditCompetitionPart.VIEW })
      .then(
        action((e) => {
          this.competition = e;
          this.compPrograms = this.competition.competitionType.compPrograms;
          this.isLoadingCompetition = false;
          // console.log("competition");
          // console.log(toJS(this.competition));
        })
      )
      .catch(
        action((err) => {
          this.isLoadingCompetition = false;
          this.notFound = true;
          if (cubaREST.restApiToken === null) {
            window.location.href = "/sign-in";
          }
        })
      );
  };

  loadEntity2 = (id?: string) => {
    return cubaREST.loadEntity("fsr_Competition", id, {
      view: EditCompetitionPart.VIEW,
    });
  };

  @action
  loadCompetitionTypes = () => {
    cubaREST
      .loadEntities("fsr_CompetitionType")
      .then((resp) => {
        runInAction(() => {
          this.competitionTypes = resp;
        });
      })
      .catch(
        action((err) => {
          if (!cubaREST.restApiToken) {
            window.location.reload();
          }
          console.log(err);
        })
      );
  };

  @action
  getCompetitionTypeById = (id) => {
    return cubaREST.loadEntity("fsr_CompetitionType", id, {
      view: "competitionType-edit-view",
    });
  };

  @computed
  get initializing(): boolean {
    return this.count == null && this.isLoadingList;
  }

  @action
  getButtons = (applicationId, userId) => {
    //   return {
    //     "reject": {
    //         "name": "standardProcForm",
    //         "caption": "Отказать",
    //         "params": [],
    //         "actProcessDefinitionId": "jasapplication:8:800012",
    //         "isDefault": false
    //     },
    //     "hz": {
    //       "name": "standardProcForm",
    //       "caption": "Отправить на доработку",
    //       "params": [],
    //       "actProcessDefinitionId": "jasapplication:8:800012",
    //       "isDefault": false
    //   },
    //     "approve": {
    //         "name": "standardProcForm",
    //         "caption": "Согласовать",
    //         "params": [],
    //         "actProcessDefinitionId": "jasapplication:8:800012",
    //         "isDefault": false
    //     }
    // }

    return cubaREST.invokeService(
      "fsr_BpmService",
      "outcomeMapByUserAndApplication",
      {
        applicationId: applicationId,
        userId: userId,
      }
    );
  };

  @action
  applicationDetailsByApplicant = () => {
    cubaREST
      .invokeService(
        "fsr_ApplicationService",
        "applicationDetailsByApplicant",
        {
          applicantId: this.rootStore.applicantsStore.applicant.id
        }
      ).then(
        (res : any) => {
          // console.info(res)
          this.details = JSON.parse(res)}
      ).catch(e => console.log(e));
  };
}
