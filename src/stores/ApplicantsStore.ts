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

export class ApplicantPart {
  static ENTITY_NAME = "fsr_Applicant";
  static VIEW = "applicant-edit-view";
}

export class ApplicantsStore {
  rootStore;
  @observable applicant: any = null;
  @observable count: number;
  @observable loading = false;
  @observable entities = [];
  @observable entitiesOne = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @computed
  private get loadOptions() {
    return {
      view: ApplicantPart.VIEW,
    };
  }

  @action
  loadEntities = () => {
    this.loading = true;
    cubaREST
      .loadEntitiesWithCount("fsr_Applicant", this.loadOptions)
      .then((resp) => {
        runInAction(() => {
          this.count = resp.count;
          this.entities = resp.result;
          this.loading = false;
        });
      })
      .catch(
        action(() => {
          this.loading = false;
        })
      );
  };

  @action
  loadApplicant = () => {
    this.loading = true;
    return cubaREST
      .searchEntitiesWithCount(
        "fsr_Applicant",
        {
          conditions: [
            {
              property: "email",
              operator: "startsWith",
              value: localStorage.getItem("applicant"),
            },
          ],
        },
        this.loadOptions
      )
      .then(
        action((resp) => {
          this.applicant = resp.result[0];
          this.loading = false;
        })
      )
      .catch(
        action(() => {
          this.loading = false;
        })
      );
  };

  @action
  loadApplicant2 = (email) => {
    return cubaREST
      .searchEntities(
        "fsr_Applicant",
        {
          conditions: [
            {
              property: "email",
              operator: "startsWith",
              value: email,
            },
          ],
        }
      )
  };
  @action
  createApplicant = (form) => {
    return cubaREST.commitEntity("fsr_Applicant", form);
  };

  @action
  updateApplicant = (form) => {
      if(form.applicantType === "STUDENT") {
        form.organization = null;
        form.staff = null;
        form.graduateNIS = null;
        form.graduateNU = null;
        form.thirdPerson = null;
      }
      if(form.applicantType === "EMPLOYEE") {
        form.organization = null;
        form.student = null;
        form.graduateNIS = null;
        form.graduateNU = null;
        form.thirdPerson = null;
      }
      if(form.applicantType === "ORGANIZATION") {
        form.staff = null;
        form.student = null;
        form.graduateNIS = null;
        form.graduateNU = null;
        form.thirdPerson = null;
      }
      if(form.applicantType === "THIRD_PERSON") {
        form.organization = null;
        form.staff = null;
        form.student = null;
        form.graduateNU = null;
        form.graduateNIS = null;
        delete form.thirdPerson.id;
        if(!form.thirdPerson.isWork) {
          form.thirdPerson.isWork = false;
        }
        if(form.thirdPerson.isWork === true) {
          form.thirdPerson.organization = null;
          form.thirdPerson.position = null;
          form.thirdPerson.department = null;
        }
        console.log(toJS(form));
        
      }

      if(form.applicantType === "GRADUATE_NIS") {
        form.organization = null;
        form.staff = null;
        form.student = null;
        form.graduateNU = null;
        form.thirdPerson = null;
        delete form.graduateNIS.id;
        
        if(!form.graduateNIS.isWork) {
          form.graduateNIS.isWork = false;
        }
        if(form.graduateNIS.isWork === true) {
          form.graduateNIS.organization = null;
          form.graduateNIS.position = null;
          form.graduateNIS.department = null;
        }
      }
      if(form.applicantType === "GRADUATE_NU") {
        if(!form.graduateNU.isWork) {
          form.graduateNU.isWork = false;
        }
        if(form.graduateNU.isWork === true) {
          form.graduateNU.organization = null;
          form.graduateNU.position = null;
          form.graduateNU.department = null;
        }
        form.organization = null;
        form.staff = null;
        form.student = null;
        form.graduateNIS = null;
        form.thirdPerson = null;
        delete form.graduateNU.id;
        if(!form.graduateNU.isWork) {
          form.graduateNU.isWork = false;
        }
      }
    cubaREST
      .invokeService("fsr_ApplicantUserService", "saveApplicant", {
        applicant: form,
      })
      .then(
        action((res) => {
          this.loadEntities();
          console.log(toJS(res));
          let result = res as string;
          let status = JSON.parse(result).status;
          let message = JSON.parse(result).message
            ? JSON.parse(result).message
            : "Произошла ошибка";
          if (status === "SUCCESS") {
            toast.success(i18next.t("Success"), {
              position: toast.POSITION.BOTTOM_CENTER,
            });
            // console.log(toJS(form.graduateNU));
            const newApplicant = form.email;
            localStorage.setItem("applicant", newApplicant);
            this.rootStore.userStore.getUserInfo();
            this.loadApplicant();
          } else if (status === "ERROR") {
            toast.error(message, {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          } else if (status === "WARNING") {
            toast.error(message, {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
          else if (status === "EMAIL_ERROR") {
            toast.error(message, {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
        })
      )
      .catch(
        action((error) => {
          if(!cubaREST.restApiToken) {
            window.location.reload();
          }
          toast.error("Ошибка сервера", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        })
      );
  };
  @action
  updateApplicant2 = (form) => {
    cubaREST
      .commitEntity("fsr_Applicant", form)
      .then(
        action((res) => {
          this.loadEntities();
          toast.success(i18next.t("Success"), {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          console.log(toJS(form));
          const newApplicant = form.email;
          localStorage.setItem("applicant", newApplicant);
          this.applicant = res;
        })
      )
      .catch(
        action((error) => {
          toast.error(i18next.t("Error"), {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        })
      );
  };

  @action
  registerApplicant = (applicant) => {
    return cubaREST.invokeService(
      "fsr_ApplicantUserService",
      "registerApplicantAndUser",
      { applicant: applicant }
    );
  };

  @action
  updateProperty(key, value) {
    this.applicant[key] = value;
  }
}
