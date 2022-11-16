import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { DashboardPage } from "./Dashboard/DashboardPage";

import Retailer_List from "./pages/Retailers/Retailer_List";
import Retailer_Detail from "./pages/Retailers/Retailer_Detail";
import Offer_List from "./pages/Offers/Offer_List";
import Inventory_List from "./pages/Inventory/Inventory_List";
import Setting from "./pages/Setting/Setting";

const Medicine_List = lazy(() => import("./pages/Medicine/Medicine_List"));

const Orders = lazy(() => import("./pages/Order/Orders"));
const Order = lazy(() => import("./pages/Order/Order"));

const Category_List = lazy(() => import("./pages/Category/Category_List"));

export default function BasePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute path="/users" component={Medicine_List} />


        <ContentRoute path="/orders" component={Orders} />
        <ContentRoute path="/order" component={Order} />

        <ContentRoute path="/category" component={Category_List} />

        <ContentRoute path="/retailers" component={Retailer_List} />
        <ContentRoute path="/retailer_detail" component={Retailer_Detail} />

        <ContentRoute path="/offers" component={Offer_List} />
        <ContentRoute path="/inventory" component={Inventory_List} />
        <ContentRoute path="/setting" component={Setting} />

        <Redirect to="/" />
      </Switch>
    </Suspense>
  );
}
