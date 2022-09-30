import * as React from "react";
import { Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

const AppRoute = ({
  component: Component,
  layout: Layout = MainLayout,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => (
      <Layout>
        <Component {...props} />
      </Layout>
    )}
  />
);

export default AppRoute;
