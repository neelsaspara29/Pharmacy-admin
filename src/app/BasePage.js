
import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { DashboardPage } from "./Dashboard/DashboardPage";

import Withdrawal from "./pages/Withdrawal/Withdrawal";
import Report from "./pages/Reports/Report";
import Event from "./pages/Events/Events";
import QandA from "./pages/Q&A/Q&A";
import Retailer_List from "./pages/Retailers/Retailer_List";
import Retailer_Detail from "./pages/Retailers/Retailer_Detail";
import Offer_List from "./pages/Offers/Offer_List";
import Inventory_List from "./pages/Inventory/Inventory_List";
import Setting from "./pages/Setting/Setting";

const User_List = lazy(() => import("./pages/Users/User_List"));
const User_Details = lazy(() => import("./pages/Users/User_Details"));
const Orders = lazy(() =>
  import("./pages/Photo Graphers/Orders")
);
const Order = lazy(() =>
  import("./pages/Photo Graphers/Order")
);
const Booking = lazy(() => import("./pages/Booking/Booking"));
const Category_List = lazy(() => import("./pages/Category/Category_List"));
const Job = lazy(() => import("./pages/Job/Job"));

export default function BasePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute path="/users" component={User_List} />
        <ContentRoute path="/user_details" component={User_Details} />

        <ContentRoute path="/orders" component={Orders} />
        <ContentRoute
          path="/order"


          component={Order}
        />  

        <ContentRoute path="/category" component={Category_List} />

        <ContentRoute path="/retailers" component={Retailer_List} />
        <ContentRoute path="/retailer_detail" component={Retailer_Detail} />

        <ContentRoute path="/offers" component={Offer_List} />
        <ContentRoute path="/inventory" component={Inventory_List} />
        <ContentRoute path="/setting" component={Setting} />

        <ContentRoute path="/booking" component={Booking} />
        <ContentRoute path="/job" component={Job} />
        <ContentRoute path="/withdrawal" component={Withdrawal} />
        <ContentRoute path="/reports" component={Report} />
        <ContentRoute path="/events" component={Event} />
        <ContentRoute path="/q&a" component={QandA} />

        <Redirect to="/" />   
      </Switch>
    </Suspense>
  );
}
