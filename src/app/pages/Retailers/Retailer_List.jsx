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

export default function Retailer_List() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [totalpage, settotalpage] = useState(0);
  const [currentpage, setcurrentpage] = useState(1);
  const [pagesize, setpagesize] = useState(10);
  const [searching, setsearching] = useState("");
  const [modal, setModal] = React.useState(false);
  const [modal1, setModal1] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [Id, setId] = React.useState();
  const [rowID, setRowID] = React.useState();

  console.log("data", data);
  const deleteUserBtn = async (id) => {
    await ApiDelete(`/user/delete_user/${id}`)
      .then(res => { SuccessToast("User has been Successfully Deleted !!!"); fetchData(1, 10, "") })
      .catch(err => { console.log('err_deleteUser', err); ErrorToast("user Not Deleted") });
  }
  const click = (v) => {
    history.push(`/retailer_detail?id=${v._id}`);
  }
  const columns = [
    // {
    //   dataField: "title",
    //   text: "Title",
    //   sort: true,
    // },
    {
      dataField: "shopName",
      text: "Name",
      sort: true,
      formatter: (cell, row) => {
        console.log("row", row);
        return (
          <div
            className="d-flex align-items-center"
          // onClick={() => history.push(`/user_details?id=${row._id}`)}
          >
            
            <div>
              <a className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg" onClick={() => click(row)}>
                {row?.shopName}
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
      dataField: "email",
      text: "Email",
      sort: true,
    },
    {
      dataField: "phoneNumber",
      text: "phone number",
      sort: true,
      
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
                <span className="svg-icon svg-icon-md svg-icon-primary">
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
                // onClick={() => deleteUserBtn(row._id)}
              >
                <span className="svg-icon svg-icon-md svg-icon-danger">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}

                  />
                </span>
              </a>
            </div>
          </div>
        )
      },
    },

    // {
    //   dataField: "postCount",
    //   text: "Total Post",
    //   sort: true,
    // },

    // {
    //   dataField: "createdAt",
    //   text: "Created At",
    //   sort: true,
    //   formatter: (cell, row) => {
    //     //
    //     return moment(row.createdAt).format("DD-MM-YYYY, h:mm a");
    //   },
    // },
  ];

  // console.log("block", block);

  const handlesearch = (e) => {
    setsearching(e.target.value);
    fetchData(currentpage, pagesize, e.target.value);
  };
  const handleonchnagespagination = (e) => {
    fetchData(1, parseInt(e.target.value), state, searching);
  };
  const handleChange = (e, i) => {
    fetchData(i, pagesize, searching);
  };

  const fetchData = async (page, limit, search) => {
    let body = {
      limit,
      page,
      search,
    };

    await ApiPost("/retailers/get", body)
      .then((res) => {
        setData(res?.data?.data?.retailersData);
        settotalpage(res?.data?.data?.state?.page_limit);
        setcurrentpage(res?.data?.data?.state?.page);
        setpagesize(res?.data?.data?.state?.limit);
      })
      .catch(async (err) => {
        ErrorToast(err?.message);
      });
  };
  // console.log("resresresresresresresresresresres", data);
  useEffect(() => {
    fetchData(currentpage, pagesize, searching);
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
                  <a class="text-muted" onClick={() => history.push("/users")}>
                    Users
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
              <h3 class="card-label">Users</h3>
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
