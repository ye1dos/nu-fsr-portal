import {SP, SE, SI, SG} from "../consts";

const manageApplication = (state, application) => {
  application.relevance = state.relevance;
  application.applicationForm = state.applicationForm;
  application.efficiencyAndResult = state.efficiencyAndResult;
  application.sustainability = state.sustainability;
  application.innovativeness = state.innovativeness;
  application.projectIdea = state.projectIdea;
  application.businessModel = state.businessModel;
  application.effectiveness = state.effectiveness;
  application.organizationPotential = state.organizationPotential;
  application.scalability = state.scalability;
  application.resource = state.resource;
  // if (application.programs[0].name === SP) {
  //   application.resource = {
  //     budget: state.resource?.budget,
  //     materialBase: state.resource?.materialBase,
  //     application: state.resource?.application
  //   };
  // }
  // else if (application.programs[0].name === SE) {
  //   application.resource = {
  //     experience: state.resource?.experience,
  //     partners: state.resource?.partners,
  //     budget: state.resource?.budget,
  //     materialBase: state.resource?.materialBase,
  //     results: state.resource?.results,
  //     application: state.resource?.application
  //   };
  // }
  // else if (application.programs[0].name === SI) {
  //   application.resource = {
  //     partners: state.resource?.partners,
  //     marketTest: state.resource?.marketTest,
  //     income: state.resource?.income,
  //     funds: state.resource?.funds,
  //     description: state.resource?.description,
  //     budget: state.resource?.budget,
  //     materialBase: state.resource?.materialBase,
  //     results: state.resource?.results,
  //     application: state.resource?.application
  //   };
  // }
  // else if (application.programs[0].name === SG) {
  //   // application.projectIdea = {
  //   //   event: state.projectIdea.event,
  //   //   deadline: state.projectIdea.deadline,
  //   // };
  // }
  if (application.resource && application.resource.budget) {
    for (let i = 0; i < application.resource.budget.length; i++) {
      application.resource.budget[i].amount = typeof application.resource.budget[i].amount === 'number' ? application.resource.budget[i].amount :  (application.resource.budget[i].amount).replace(/^\s+|\s+|\s$/g, '') - 0;
      application.resource.budget[i].quantity = typeof application.resource.budget[i].quantity === 'number' ? application.resource.budget[i].quantity :  (application.resource.budget[i].quantity).replace(/^\s+|\s+|\s$/g, '');
      application.resource.budget[i].price = typeof application.resource.budget[i].price === 'number' ? application.resource.budget[i].price : (application.resource.budget[i].price).replace(/^\s+|\s+|\s$/g, '');
    }
  }
  if (application.applicationForm?.applicantKind === "INDIVIDUAL") {
    delete application.applicationForm.organizationName
    delete application.applicationForm.activityDirection
  }
  if(state.teamMembers && (state.teamMembers.length == 0 || state.teamMembers === [])) {
    delete application.teamMembers;
  }
  return application;
}
export default manageApplication;
