import React, { useEffect, useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { lighten, makeStyles } from "@material-ui/core/styles";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import moment from "moment";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import {
  ApiDelete,
  ApiGet,
  ApiPost,
  Bucket,
  reftoken,
} from "../../../helpers/API/ApiData";
import BootstrapTable from "react-bootstrap-table-next";
import Pagination from "@material-ui/lab/Pagination";
import paginationFactory from "react-bootstrap-table2-paginator";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Dropdown, Form, Modal } from "react-bootstrap";
// import { Modal } from "react-bootstrap";
import { HiOutlineChevronRight } from "react-icons/hi";
// import User_Edit from "./User_Edit";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import NoDataTable from "../../../common/noDataTable";
import axios from "axios";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    boxShadow: "none",
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  card: {
    height: "100%",

    backgroundColor: "#fff",
    border: "none",
    borderRadius: "10px",
  },
}));

export default function Orders() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState("approve");
  const [data, setData] = React.useState([]);
  const [category, setGategory] = React.useState([]);

  const [totalpage, settotalpage] = useState(0);
  const [currentpage, setcurrentpage] = useState(1);
  const [pagesize, setpagesize] = useState(10);
  const [searching, setsearching] = useState("");
  const [selectCat, setSelectCat] = useState("");
  const [modal, setModal] = React.useState(false);
  const [modal1, setModal1] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [Id, setId] = React.useState();
  const [rowID, setRowID] = React.useState();

  
  const approveBtn = async (row) => {
    let body = {
      id: row._id,
      isPhotographerVerified: "approve",
    };
    ApiPost("/photographer_verification", body)
      .then(
        (res) => console.log("approve_res", res),
        fetchData(1, 10, "", "request"),
        SuccessToast("Photographer Verification Successfully Approved !")
      )
      .catch((err) => console.log("err", err));
  };
  const rejectBtn = async (row) => {
    let body = {
      id: row._id,
      isPhotographerVerified: "reject",
    };
    ApiPost("/photographer_verification", body)
      .then(
        (res) => console.log("reject_res", res),
        fetchData(1, 10, "", "request"),
        SuccessToast("Photographer Verification Successfully Rejected !")
      )
      .catch((err) => console.log("err", err));
  };
  const deleteUserBtn = async (id) => {
    await ApiDelete(`/photographer/delete_photographer/${id}`)
      .then((res) => {
        SuccessToast("Photographer has been Successfully Deleted !!!");
        fetchData(1, 10, "", "approve");
      })
      .catch((err) => {
        console.log("err_deleteUser", err);
        ErrorToast("photographer Not Deleted");
      });
  };
  const columns = [
    {
      dataField: "orderId",
      text: "ORDER ID",
      sort: true,
      formatter: (cell, row, index) => {
        console.log(cell, row, index);
        return <span className="text-danger">#{index+1}</span>;
      },
    },
    {
      dataField: "name",
      text: "PHARMACY NAME",
      sort: true,
      formatter: (cell, row) => {
      
        return (
          <div className="d-flex align-items-center">
            <div className="symbol symbol-50 symbol-light mr-2">
              <img
                src={
                  row.mainImagee
                    ? row.mainImage
                    : "https://img.icons8.com/clouds/100/000000/user.png"
                }
                width={30}
                height={30}
                className="img-fluid"
                style={{ objectFit: "cover", width: "30px", height: "30px" }}
              />
            </div>
            <div>
              <a
                className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg"
                onClick={() => click(row)}
              >
                {row?.userShopData?.shopName}
              </a>
            </div>
          </div>
        );
      },
      // sort: true,
      //   sortCaret: sortCaret,
      // headerSortingClasses,
    },
    {
      dataField: "status",
      text: "STATUS",
      sort: true,
      formatter: (cell, row) => {
        if (row.orderStatus == 0) {
          return <div className="text-danger">Pending</div>
        }
       else if (row.orderStatus == 1) {
          return <div className="text-warning">Placed</div>;
        } else if (row.orderStatus == 2) {
          return <div className="text-info">Packed</div>;
        } else if(row.orderStatus==3) {
          return <div className="text-primary">Shipping</div>;
        }else{
          return  <div className="text-success">Delivered</div>
        }
      },
    },
    {
      dataField: "total",
      text: "TOTAL",
      sort: true,
    },
    {
      dataField: "updatedAt",
      text: "DATA",
      sort: true,
      formatter: (cell, row) => {
        return <div>{moment(row.data).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      dataField: "action",
      text: "action",
      sort: true,
      formatter: (cell, row) => {
        return (
          <div className="d-flex align-items-center">
            <div clas sName="symbol symbol-50 symbol-light">
              <a
                title="Edit customer"
                className="btn btn-icon btn-light btn-hover-primary btn-sm me-3"
                onClick={() => click(row)}
              >
                <span className="svg-icon svg-icon-md svg-icon-primary" onClick={()=>history.push('/order?'+row._id)}>
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/svg/icons/Communication/Write.svg"
                    )}
                  />
                </span>
              </a>
              <a
                title="Delete customer"
                className="btn btn-icon btn-light btn-hover-danger btn-sm"
                onClick={() => deleteUserBtn(row._id)}
              >
                <span className="svg-icon svg-icon-md svg-icon-danger">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                  />
                </span>
              </a>
            </div>
          </div>
        );
      },
    },
  ];

  const click = (v) => {
    let str = "?id=" + v._id;
    history.push( {
      pathname: '/order',
      search: str
  })
  };

  // console.log("block", block);

  const handlesearch = (e) => {
    setsearching(e.target.value);
  };
  const handleonchnagespagination = (e) => {
    fetchData(1, parseInt(e.target.value), state, searching, state);
  };
  const handleChange = (e, i) => {
    fetchData(i, pagesize, searching, state);
  };

  const handleSelect = (e) => {
    const { value } = e.target;
    setSelectCat(value);
  };

  const fetchData = async (page, limit, search, status) => {
    console.log("body out"); 
  
   
    await ApiPost("/orders/get",{
      "page" : 1,
      "limit" : 10 ,
      "search" : "",
  })
    .then((res) => {
      console.log("res",res);
      setData(res?.data?.data.ordersData)

    })
    .catch(async (err) => {
      console.log("error",err)
      ErrorToast(err?.message);
    });
    let arr = [
      {
        orderId: 320,
        pharmacyName: "Shubham HealthCare",
        total: "50000",
        data: new Date(),
        status: 1,
      },
      {
        orderId: 320,
        pharmacyName: "Nell HealthCare",
        total: "10000",
        data: new Date(),
        status: 0,
      },
      {
        orderId: 320,
        pharmacyName: "Arpit HealthCare",
        total: "25000",
        data: new Date(),
        status: 2,
      },
      {
        orderId: 320,
        pharmacyName: "Ankit HealthCare",
        total: "55000",
        data: new Date(),
        status: 1,
      },
      {
        orderId: 320,
        pharmacyName: "India HealthCare",
        total: "50000",
        data: new Date(),
        status: 1,
      },
      {
        orderId: 320,
        pharmacyName: "Hindustan HealthCare",
        total: "650000",
        data: new Date(),
        status: 1,
      },
      {
        orderId: 320,
        pharmacyName: "Bharat HealthCare",
        total: "150000",
        data: new Date(),
        status: 0,
      },
      {
        orderId: 320,
        pharmacyName: "SoneKiChidiya HealthCare",
        total: "500000",
        data: new Date(),
        status: 2,
      },
    ];
    // setData(...data,arr);
  };

  const handleonchnagestatus = (e) => {
    // console.log(e.target.value);
    console.log("statsiss....................................", e);
    setState(e);
    fetchData(currentpage, pagesize, searching, e);
  };

  const getOrders = async () => {
    await ApiPost("/orders/get",)
      .then((res) => {
        console.log("res.data.data", res.data.data);
        setGategory(res?.data?.data);
      })
      .catch(async (err) => {
        ErrorToast(err?.message);
      });
  };
  // console.log("resresresresresresresresresresres", data);
  useEffect(() => {
    fetchData(currentpage, pagesize, searching, state);
  }, []);

 
  return (
    <>
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
                  <a
                    class="text-muted"
                  >
                    Orders
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        class="content  d-flex flex-column flex-column-fluid  h-100"
        id="kt_content"
      >
        <div class="card card-custom">
          <div class="card-header flex-wrap border-0 pt-6 pb-0">
            <div class="card-title">
              <h3 class="card-label">Orders</h3>
            </div>
          </div>

          <div className={`card h-80  d-flex  ${classes.card}`}>
            {/* Body */}
            <div className=" card-body">
              <div class="mb-5">
                <div class="row align-items-center">
                  <div class="col-lg-9 col-xl-8">
                    <div class="row align-items-center">
                      <div class="col-md-4 my-2 my-md-0">
                        <div class="input-icon">
                          <input
                            type="text"
                            class="form-control"
                            name="searchText"
                            placeholder="Search by name"
                            value={searching}
                            onChange={(e) => handlesearch(e)}
                            id="kt_datatable_search_query"
                          />
                          <span>
                            <i class="flaticon2-search-1 text-muted"></i>
                          </span>
                        </div>
                      </div>
                      <div className="col-md-3 my-2">
                        {/* <Dropdown onSelect={handleonchnagestatus}>
                          <Dropdown.Toggle
                            id="dropdown-basic"
                            className="text-capitalize"
                          >
                            {state}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item eventKey="complited">
                              Complited
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="cancelled">
                              Cancelled
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="pending">
                              Pending
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown> */}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                // remote
                keyField="id"
                data={data}
                columns={columns}
                // pagination={paginationFactory(options)}
                // defaultSorted={defaultSorted}
                noDataIndication={() => <NoDataTable />}
                // filter={filterFactory()}
                // headerClasses="header-class"
              />
              <div class="d-flex justify-content-between pt-10">
                <div className="my-2">
                  <Pagination
                    count={totalpage}
                    page={currentpage}
                    onChange={handleChange}
                    variant="outlined"
                    shape="rounded"
                    className="pagination_"
                  />
                </div>
                <div class="my-2 my-md-0">
                  <div class="d-flex align-items-center pagination-drpdown">
                    <select
                      class="form-control pagination-drpdown1 dropdownPage"
                      id="kt_datatable_search_status"
                      onChange={(e) => handleonchnagespagination(e)}
                      value={pagesize}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* {open && (
            <User_Edit
              open={open}
              setOpen={setOpen}
              rowID={rowID}
              setRowID={setRowID}
              fetchDatas={fetchData}
            />
          )} */}
        </div>
      </div>
    </>
  );
}
