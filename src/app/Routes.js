/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React from "react";
import { Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";

export function Routes() {
  // const isAuthorized = localStorage.getItem("token") ? true :false
  const { isAuthorized } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user != null,
    }),
    shallowEqual
  );
  console.log("isAuthorized", isAuthorized);
  return (
    <Switch>
      {!isAuthorized ? (
        /*Render auth page when user at `/auth` and not authorized.*/
        <Route>
          <AuthPage />
          {/* <Redirect to="/auth/login" /> */}
        </Route>
      ) : (
        /*Otherwise redirect to root page (`/`)*/
        // <Redirect from="/auth" to="/" />
        <Layout>
          <BasePage />
        </Layout>
      )}

      <Route path="/error" component={ErrorsPage} />
      <Route path="/logout" component={Logout} />
      {/* 
      {!isAuthorized ? (
        <Redirect to="/auth/login" />
      ) : (
        <Layout>
          <BasePage />
        </Layout>
      )} */}
    </Switch>
  );
}
