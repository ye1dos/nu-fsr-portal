import React, { Fragment } from "react";
import { Switch } from "react-router-dom";
import "./assets/css/reset.css";
import "./assets/css/main.css";
import "./App.css";
import AuthLayout from "./layouts/AuthLayout";
import HeaderLayout from "./layouts/HeaderLayout";
import AppRoute from "./AppRoute";
import MainPage from "./pages/MainPage";
import Competitions from "./pages/Competitions";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SignUpConfirm from "./pages/SignUpConfirm";
import CompetitionDetail from "./pages/CompetitionDetail";
import ApplicationDetail from "./pages/ApplicationDetail";
import Cabinet from "./pages/Cabinet";
import ContractDetail from "./pages/ContractDetail";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordConfirm from "./pages/ForgotPasswordConfirm";
import RestorePassword from "./pages/RestorePassword";
import FAQ from "./pages/FAQ";
import { ToastContainer } from "react-toastify";

const App: React.FC = (props) => {
  return (
    <Fragment>
      <Switch>
        <AppRoute path="/competition/:id" component={CompetitionDetail} exact />
        <AppRoute
          path="/application/:id/:compId"
          component={ApplicationDetail}
          exact
        />
        <AppRoute path="/competitions" component={Competitions} />
        <AppRoute path="/our-projects" component={MainPage} />
        <AppRoute path="/sign-in" component={SignIn} layout={AuthLayout} />
        <AppRoute
          path="/sign-up"
          component={SignUp}
          layout={AuthLayout}
          exact
        />
        <AppRoute
          path="/sign-up/confirmation"
          component={SignUpConfirm}
          layout={AuthLayout}
        />
        <AppRoute
          path="/registration/:hash"
          component={Register}
          layout={AuthLayout}
          exact
        />
        <AppRoute
          path="/restore-password/:hash"
          component={RestorePassword}
          layout={AuthLayout}
          exact
        />
        <AppRoute
          path="/forgot-password/confirmation"
          component={ForgotPasswordConfirm}
          layout={AuthLayout}
          exact
        />
        <AppRoute
          path="/forgot-password"
          component={ForgotPassword}
          layout={AuthLayout}
          exact
        />
        <AppRoute path="/cabinet" component={Cabinet} />
        <AppRoute path="/contract/:id" component={ContractDetail} />
        <AppRoute path="/faq" component={FAQ} />
        <AppRoute exact={true} path="/" component={MainPage} />
        <AppRoute component={NotFound} layout={HeaderLayout} />
      </Switch>
      <ToastContainer />
    </Fragment>
  );
};

export default App;
