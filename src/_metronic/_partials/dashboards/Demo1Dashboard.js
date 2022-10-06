import React, { useEffect, useState } from "react";
import {
  MixedWidget1,
  MixedWidget14,
  ListsWidget9,
  StatsWidget11,
  StatsWidget12,
  ListsWidget1,
  AdvanceTablesWidget2,
  AdvanceTablesWidget4,
  ListsWidget3,
  ListsWidget4,
  ListsWidget8,
} from "../widgets";
import {FaShippingFast} from 'react-icons/fa'
import {MdOutlinePendingActions} from 'react-icons/md'
import {BsGraphUp} from 'react-icons/bs'
import {GoGraph} from 'react-icons/go'
import { ApiPost } from "../../../helpers/API/ApiData";
import { ErrorToast } from "../../../helpers/Toast";
import { useHistory } from "react-router-dom";
export function Demo1Dashboard() {
    const [Data, setData] = useState()
    const [time, setTime] = useState(0)
    const history = useHistory();
    const fetchData = async () => {
        // console.log("body out");
        let body = {
            
           timePeriod : time
            
        };
    
        await ApiPost("/get/dashboard", body)
          .then((res) => {
            console.log("res.data.data", res.data.data);
            setData(res?.data?.data);
      
          })
          .catch(async (err) => {
            ErrorToast(err?.message);
          });
      };
    useEffect(() => {
            fetchData()
    },[time])
  return (
    <>
      <div className="row">
        <div className="col-lg-12 col-xxl-12">
          {/* <MixedWidget1 className="card-stretch gutter-b"/> */}
          {/* time line */}
          <div
            class="nav nav-tabs tab-card tab-body-header rounded  d-inline-flex w-sm-100 nav nav-pills mb-3"
            role="tablist"
          >
            <div class="nav-item nav-item">
              <a
                role="tab"
                data-rr-ui-event-key="first"
                id="left-tabs-example-tab-first"
                aria-controls="left-tabs-example-tabpane-first"
                onClick={() => {setTime(0)}}
                class={ time == 0 ? "nav-link active"  :"nav-link" }
                tabindex="-1"
              >
                Today
              </a>
            </div>
            <div class="nav-item nav-item">
              <a
                role="tab"
                data-rr-ui-event-key="second"
                id="left-tabs-example-tab-second"
                aria-controls="left-tabs-example-tabpane-second"
                onClick={() => {setTime(1)}}
                class={ time == 1 ? "nav-link active"  :"nav-link" }
                tabindex="-1"
              >
                Week
              </a>
            </div>
            <div class="nav-item nav-item">
              <a
                role="tab"
                data-rr-ui-event-key="third"
                id="left-tabs-example-tab-third"
                aria-controls="left-tabs-example-tabpane-third"
                onClick={() => {setTime(2)}}
                class={ time == 2 ? "nav-link active"  :"nav-link" }
                aria-selected="true"
              >
                Month
              </a>
            </div>
            <div class="nav-item nav-item">
              <a
                role="tab"
                data-rr-ui-event-key="fourth"
                id="left-tabs-example-tab-fourth"
                aria-controls="left-tabs-example-tabpane-fourth"
                onClick={() => {setTime(3)}}
                class={ time == 3 ? "nav-link active"  :"nav-link" }
                tabindex="-1"
              >
                Year
              </a>
            </div>
          </div>
          {/* main dashboard */}
          <div class="row g-3 mt-3 mb-3 row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
            <div class="col">
              <div class="alert-success alert mb-0">
                <div class="d-flex align-items-center">
                  <div class="avatar rounded no-thumbnail bg-success text-light">
                    <GoGraph fontSize = {"35px"} />
                  </div>
                  <div class="flex-fill ms-3 text-truncate">
                    <div class="h6 mb-0">Total Orders</div>
                    <span class="small" style={{fontSize: "20px"}}>{Data?.totalOrders}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="alert-danger alert mb-0">
                <div class="d-flex align-items-center">
                  <div class="avatar rounded no-thumbnail bg-danger text-light">
                    <FaShippingFast fontSize={"35px"} />
                  </div>
                  <div class="flex-fill ms-3 text-truncate">
                    <div class="h6 mb-0">Processing Orders</div>
                    <span class="small" style={{fontSize: "20px"}}>{Data?.processingOrders}</span>
                  </div>
                </div>
              </div>
            </div>            
            <div class="col">
              <div class="alert-warning alert mb-0">
                <div class="d-flex align-items-center">
                  <div class="avatar rounded no-thumbnail bg-warning text-light">
                    <BsGraphUp fontSize={"35px"} />
                  </div>
                  <div class="flex-fill ms-3 text-truncate">
                    <div class="h6 mb-0">Total Sales</div>
                    <span class="small" style={{fontSize: "20px"}}>{Data?.totalSales}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="alert-info alert mb-0">
                <div class="d-flex align-items-center">
                  <div class="avatar rounded no-thumbnail bg-info text-light">
                    <MdOutlinePendingActions fontSize={"35px"} />
                  </div>
                  <div class="flex-fill ms-3 text-truncate">
                    <div class="h6 mb-0">Pending Invoice</div>
                    <span class="small" style={{fontSize: "20px"}}>{Data?.pendingInvoice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


    {/* lower dashnoad */}

        <div class="col-sm-12 mt-4">
          {/* <div class="tab-content mt-1 tab-content"> */}
            <div>
            
            <div
            //   id="left-tabs-example-tabpane-third"
            //   role="tabpanel"
            //   aria-labelledby="left-tabs-example-tab-third"
              class="fade tab-pane fade show tab-pane active show"
            >
              <div class="row g-3 mb-4 row-deck">
                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6">
                  <div class="card">
                    <div class="card-body py-xl-4 py-3 d-flex flex-wrap align-items-center justify-content-between">
                      <div class="left-info pointer" onClick={()=> {history.push('/retailers')}} >
                        <span class="text-muted">Active Retailer</span>
                        <div>
                          <span class="fs-6 fw-bold me-2">{Data?.activeRetailers}</span>
                        </div>
                      </div>
                      <div class="right-icon">
                        <i class="icofont-student-alt fs-3 color-light-orange"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6">
                  <div class="card">
                    <div class="card-body py-xl-4 py-3 d-flex flex-wrap align-items-center justify-content-between">
                      <div class="left-info pointer" onClick={() => {history.push('/orders')}}>
                        <span class="text-muted">Order</span>
                        <div>
                          <span class="fs-6 fw-bold me-2">{Data?.orders}</span>
                        </div>
                      </div>
                      <div class="right-icon">
                        <i class="icofont-shopping-cart fs-3 color-lavender-purple"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6">
                  <div class="card">
                    <div class="card-body py-xl-4 py-3 d-flex flex-wrap align-items-center justify-content-between">
                      <div class="left-info">
                        <span class="text-muted">Cancel Oredrs</span>
                        <div>
                          <span class="fs-6 fw-bold me-2">{Data?.cancelledOrders}</span>
                        </div>
                      </div>
                      <div class="right-icon">
                        <i class="icofont-sale-discount fs-3 color-santa-fe"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6">
                  <div class="card">
                    <div class="card-body py-xl-4 py-3 d-flex flex-wrap align-items-center justify-content-between">
                      <div class="left-info">
                        <span class="text-muted">Processing Order</span>
                        <div>
                          <span class="fs-6 fw-bold me-2">{Data?.processingOrdersOverall}</span>
                        </div>
                      </div>
                      <div class="right-icon">
                        <i class="icofont-calculator-alt-2 fs-3 color-danger"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6">
                  <div class="card">
                    <div class="card-body py-xl-4 py-3 d-flex flex-wrap align-items-center justify-content-between">
                      <div class="left-info">
                        <span class="text-muted">Total Sale</span>
                        <div>
                          <span class="fs-6 fw-bold me-2">{Data?.totalSaleOverAll}</span>
                        </div>
                      </div>
                      <div class="right-icon">
                        <i class="icofont-calculator-alt-1 fs-3 color-lightblue"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6">
                  <div class="card">
                    <div class="card-body py-xl-4 py-3 d-flex flex-wrap align-items-center justify-content-between">
                      <div class="left-info pointer" onClick={() => {history.push('/users')}}>
                        <span class="text-muted">Total Medicine</span>
                        <div>
                          <span class="fs-6 fw-bold me-2">{Data?.totalMedicine}</span>
                        </div>
                      </div>
                      <div class="right-icon">
                        <i class="icofont-users-social fs-3 color-light-success"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* </div> */}
          </div>
        </div>
        {/* <div className="col-lg-6 col-xxl-4">
                    <ListsWidget9 className="card-stretch gutter-b"/>
                </div> */}

        {/* <div className="col-lg-6 col-xxl-4">
                    <StatsWidget11 className="card-stretch card-stretch-half gutter-b"/>
                    
                </div>
                <div className="col-lg-6 col-xxl-4">
                <StatsWidget12 className="card-stretch card-stretch-half gutter-b"/>
                    
                </div> */}

        {/* <div className="col-lg-6 col-xxl-4 order-1 order-xxl-1">
                    <ListsWidget1 className="card-stretch gutter-b"/>
                </div>
                <div className="col-xxl-8 order-2 order-xxl-1">
                    <AdvanceTablesWidget2 className="card-stretch gutter-b"/>
                </div>
                <div className="col-lg-6 col-xxl-4 order-1 order-xxl-2">
                    <ListsWidget3 className="card-stretch gutter-b"/>
                </div>
                <div className="col-lg-6 col-xxl-4 order-1 order-xxl-2">
                    <ListsWidget4 className="card-stretch gutter-b"/>
                </div>
                <div className="col-lg-12 col-xxl-4 order-1 order-xxl-2">
                    <ListsWidget8 className="card-stretch gutter-b"/>
                </div> */}
      </div>
      {/* <div className="row">
                <div className="col-lg-4">
                    <MixedWidget14 className="card-stretch gutter-b" />
                </div>
                <div className="col-lg-8">
                    <AdvanceTablesWidget4 className="card-stretch gutter-b" />
                </div>
            </div> */}
    </>
  );
}
