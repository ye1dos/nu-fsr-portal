import { action, observable, toJS } from "mobx";
import { cubaREST, myCuba } from "../cubaREST";
export class FilesStore {
  rootStore;
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  downloadFile(id) {
    return cubaREST.getFile(id);
  }

  @action
  loadDocument(id) {
    return cubaREST.loadEntity("fsr_Doc", id, { view: "doc-edit-view" });
  }

  loadAttachment(id) {
    return cubaREST.loadEntity("fsr_CompetitionAttachment", id, {
      view: "competitionAttachment-edit-view"
    });
  }

  @action
  updateDocument(document): Promise<any> {
    return cubaREST.commitEntity("fsr_Doc", document);
  }
  @action
  updateTMDocument(document): Promise<any> {
    return cubaREST.commitEntity("fsr_TeamMemberDoc", document);
  }
  @action
  uploadFile(file) {
    return myCuba({
      method: "post",
      url: "/files",
      params: {
        name: file.name
      },
      data: file
    });
  }
}
