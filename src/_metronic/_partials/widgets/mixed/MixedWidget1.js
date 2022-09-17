/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
// import { Nav, Tab } from "react-bootstrap";
// import { Dropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import Pagination from "@material-ui/lab/Pagination";
import { toAbsoluteUrl } from "../../../_helpers";
import { useHtmlClassService } from "../../../layout";
// import { DropdownMenu2 } from "../../dropdowns";
// import { toast, ToastContainer } from "react-toastify";
import { Form, Modal } from "react-bootstrap";
// import { DropdownCustomToggler, DropdownMenu4 } from "../../dropdowns";
import {
  ApiDelete,
  ApiGet,
  ApiPost,
  ApiPut,
  Bucket,
  reftoken,
} from "../../../../helpers/API/ApiData";
import { ErrorToast, SuccessToast } from "../../../../helpers/Toast";
// import noDataTable from "../../../../common/noDataTable";
import NoDataTable from "../../../../common/noDataTable";
import { ToastContainer } from "react-toastify";
// import { BreadCrumbs } from "../../../layout/components/subheader/components/BreadCrumbs";

export function MixedWidget1({ className }) {
  const history = useHistory();
  const [accountdata, setaccountdata] = useState({});
  const [data, setData] = React.useState({});

  useEffect(() => {
    // ApiGet("/dashboard")
    //   .then((res) => setaccountdata(res.data.data))
    //   .catch((err) => ErrorToast(err.message));
  }, []);
  console.log("data", accountdata);

  return (
    <>
      {/* <BreadCrumbs items={dashbord} /> */}
      <div
        class="subheader py-2 py-lg-6  subheader-transparent "
        id="kt_subheader"
      >
        <div class=" container  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
          <div class="d-flex align-items-center flex-wrap mr-1">
            <div class="d-flex align-items-baseline flex-wrap mr-5">
              <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                <li class="breadcrumb-item">
                  <a
                    class="text-muted"
                    onClick={() => history.push("/dashboard")}
                  >
                    Home
                  </a>
                </li>
                <li class="breadcrumb-item">
                  <a class="text-muted">Dashboard</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-10">
        <div className={` ${className} col-lg-4 col-xxl-4`}>
          <div className="card card-custom bg-gray-100">
            {/* Header */}

            {/* Body */}
            <div className="card-body p-0 position-relative overflow-hidden">
              {/* Chart */}
              <div
                id="kt_mixed_widget_2_chart"
                className="card-rounded-bottom bg-danger"
                style={{ height: "200px" }}
              ></div>

              {/* Stat */}
              <div className="card-spacer mt-n25">
                <div className="row m-0">
                  <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                      {/* <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Media/Equalizer.svg")}
                  
                ></SVG> */}
                      <a className="text-warning font-weight-bold font-size-h6">
                        {accountdata.today_order}
                      </a>
                    </span>
                    <a
                      className="text-warning font-weight-bold font-size-h6"
                      onClick={() => history.push("/booking")}
                    >
                      Today Booking
                    </a>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7">
                    <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                      {/* <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                ></SVG> */}
                      <a className="text-warning font-weight-bold font-size-h6 mt-2">
                        {accountdata && accountdata?.today_earning && accountdata?.today_earning[0]?.total_earning}
                      </a>
                    </span>
                    <a
                      className="text-warning font-weight-bold font-size-h6 mt-2"
                    // onClick={() => history.push("/post_List")}
                    >
                      Today Earning
                    </a>
                  </div>
                </div>
              </div>

              {/* Resize */}
              <div className="resize-triggers">
                <div className="expand-trigger">
                  <div style={{ width: "411px", height: "461px" }} />
                </div>
                <div className="contract-trigger" />
              </div>
            </div>
          </div>
        </div>
        <div className={`${className} col-lg-4 col-xxl-4`}>
          <div className="card card-custom bg-gray-100">
            {/* Header */}

            {/* Body */}
            <div className="card-body p-0 position-relative overflow-hidden">
              {/* Chart */}
              <div
                id="kt_mixed_widget_2_chart"
                className="card-rounded-bottom bg-danger"
                style={{ height: "200px" }}
              ></div>

              {/* Stat */}
              <div className="card-spacer mt-n25">
                <div className="row m-0">
                  <div className="col bg-light-primary px-6 py-8 rounded-xl mr-7 mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                      {/* <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Media/Equalizer.svg")}
                ></SVG> */}
                      <a className="text-primary font-weight-bold font-size-h6">
                        {accountdata.monthly_order}
                      </a>
                    </span>
                    <a
                      className="text-primary font-weight-bold font-size-h6"
                    // onClick={() => history.push("/category_List")}
                    >
                      Monthly Booking
                    </a>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col bg-light-primary px-6 py-8 rounded-xl mr-7">
                    <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                      {/* <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                ></SVG> */}
                      <a className="text-primary font-weight-bold font-size-h6 mt-2">
                        {accountdata && accountdata.monthly_earning && accountdata.monthly_earning[0]?.total_earning}
                      </a>
                    </span>
                    <a
                      className="text-primary font-weight-bold font-size-h6 mt-2"
                    // onClick={() => history.push("/software_List")}
                    >
                      Monthly Earning
                    </a>
                  </div>
                </div>
              </div>

              {/* Resize */}
              <div className="resize-triggers">
                <div className="expand-trigger">
                  <div style={{ width: "411px", height: "461px" }} />
                </div>
                <div className="contract-trigger" />
              </div>
            </div>
          </div>
        </div>
        <div className={`${className} col-lg-4 col-xxl-4`}>
          <div className="card card-custom bg-gray-100">
            {/* Header */}

            {/* Body */}
            <div className="card-body p-0 position-relative overflow-hidden">
              {/* Chart */}
              <div
                id="kt_mixed_widget_2_chart"
                className="card-rounded-bottom bg-danger"
                style={{ height: "200px" }}
              ></div>

              {/* Stat */}
              <div className="card-spacer mt-n25">
                <div className="row m-0">
                  <div className="col bg-light-success px-6 py-8 rounded-xl mr-7 mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                      {/* <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Media/Equalizer.svg")}
                ></SVG> */}
                      <a className="text-success font-weight-bold font-size-h6">
                        {accountdata.yearly_order}
                      </a>
                    </span>
                    <a className="text-success font-weight-bold font-size-h6">
                      Yearly Booking
                    </a>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col bg-light-success px-6 py-8 rounded-xl">
                    <span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                      {/* <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Urgent-mail.svg"
                  )}
                ></SVG> */}
                      <a className="text-success font-weight-bold font-size-h6 mt-2">
                        {accountdata && accountdata.year_earning && accountdata.year_earning[0]?.total_earning}
                      </a>
                    </span>
                    <a className="text-success font-weight-bold font-size-h6 mt-2">
                      Yearly Earning
                    </a>
                  </div>
                </div>
              </div>

              {/* Resize */}
              <div className="resize-triggers">
                <div className="expand-trigger">
                  <div style={{ width: "411px", height: "461px" }} />
                </div>
                <div className="contract-trigger" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
