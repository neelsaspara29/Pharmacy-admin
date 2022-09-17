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

export default function Photo_Grapher() {
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

  console.log("data", data);
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
    // {
    //   dataField: "title",
    //   text: "Title",
    //   sort: true,
    // },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      formatter: (cell, row) => {
        //
        console.log("row", row);
        console.log("data...................", row);
        return (
          <div
            className="d-flex align-items-center"
            // onClick={() => history.push(`/user_details?id=${row._id}`)}
          >
            <div className="symbol symbol-50 symbol-light mr-4">
              {/* <span className="symbol-label">
                <span className="svg-icon h-75 align-self-end"> */}
              {row?.profile_image?.split("/")[2] ==
              "lh3.googleusercontent.com" ? (
                <img
                  src={
                    row.profile_image
                      ? row.profile_image
                      : "https://img.icons8.com/clouds/100/000000/user.png"
                  }
                  className="img-fluid w-50px"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <img
                  src={
                    row.profile_image
                      ? row.profile_image
                      : "https://img.icons8.com/clouds/100/000000/user.png"
                  }
                  className="img-fluid w-50px"
                  style={{ objectFit: "cover" }}
                />
              )}
              {/* {row &&  row.original &&  row.original.image && row.original.image.split("/")[2]=="lh3.googleusercontent.com"?<Avatar  style={{ borderRadius: "6px" }} src={row.original.image ? row.original.image : "https://img.icons8.com/clouds/100/000000/user.png"} /> : <Avatar  style={{ borderRadius: "6px" }} src={row.original.image ? Bucket + row.original.image : "https://img.icons8.com/clouds/100/000000/user.png"} />} */}
              {/* </span>
              </span> */}
            </div>
            <div>
              <a
                className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg"
                onClick={() => click(row)}
              >
                {row?.firstName} {row?.lastName}
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
      dataField: "date",
      text: "Login Type",
      sort: true,
      formatter: (cell, row) => {
        //
        return row.loginType == 0
          ? " Manual"
          : row.loginType == 1
          ? "Google"
          : "Facebook";
      },
    },
    {
      dataField: "action",
      text: "Actions",
      headerStyle: {
        display: "flex",
        // justifyContent: "start",
        // flexDirection: "column-reverse",
      },
      formatter: (cell, row) => {
        if (row.isPhotographerVerified == "approve") {
          return (
            <div className="d-flex justify-content-start">
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
                onClick={() => deleteUserBtn(row._id)}
              >
                <span className="svg-icon svg-icon-md svg-icon-danger">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                  />
                </span>
              </a>
            </div>
          );
        }
        if (row.isPhotographerVerified == "request") {
          return (
            <div class="d-flex justify-content-start">
              <a
                title="Edit customer"
                class="btn btn-icon btn-light btn-hover-primary btn-sm me-3"
                onClick={() => approveBtn(row)}
              >
                <span class="svg-icon svg-icon-md svg-icon-primary">
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Stockholm-icons / Navigation / Check</title>
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g
                      id="Stockholm-icons-/-Navigation-/-Check"
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      <polygon
                        id="Shape"
                        points="0 0 24 0 24 24 0 24"
                      ></polygon>
                      <path
                        d="M6.26193932,17.6476484 C5.90425297,18.0684559 5.27315905,18.1196257 4.85235158,17.7619393 C4.43154411,17.404253 4.38037434,16.773159 4.73806068,16.3523516 L13.2380607,6.35235158 C13.6013618,5.92493855 14.2451015,5.87991302 14.6643638,6.25259068 L19.1643638,10.2525907 C19.5771466,10.6195087 19.6143273,11.2515811 19.2474093,11.6643638 C18.8804913,12.0771466 18.2484189,12.1143273 17.8356362,11.7474093 L14.0997854,8.42665306 L6.26193932,17.6476484 Z"
                        id="Path-94"
                        fill="#000000"
                        fill-rule="nonzero"
                        transform="translate(11.999995, 12.000002) rotate(-180.000000) translate(-11.999995, -12.000002) "
                      ></path>
                    </g>
                  </svg>
                </span>
              </a>
              <a
                title="Delete customer"
                class="btn btn-icon btn-light btn-hover-danger btn-sm"
                onClick={() => rejectBtn(row)}
              >
                <span class="svg-icon svg-icon-md svg-icon-danger">
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Stockholm-icons / Navigation / Close</title>
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g
                      id="Stockholm-icons-/-Navigation-/-Close"
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      <g
                        id="Group"
                        transform="translate(12.000000, 12.000000) rotate(-45.000000) translate(-12.000000, -12.000000) translate(4.000000, 4.000000)"
                        fill="#000000"
                      >
                        <rect
                          id="Rectangle-185"
                          x="0"
                          y="7"
                          width="16"
                          height="2"
                          rx="1"
                        ></rect>
                        <rect
                          id="Rectangle-185-Copy"
                          opacity="0.3"
                          transform="translate(8.000000, 8.000000) rotate(-270.000000) translate(-8.000000, -8.000000) "
                          x="0"
                          y="7"
                          width="16"
                          height="2"
                          rx="1"
                        ></rect>
                      </g>
                    </g>
                  </svg>
                </span>
              </a>{" "}
            </div>
          );
        }
        if (row.isPhotographerVerified == "reject") {
          return (
            <div className="text-start">
              <a
                title="Delete customer"
                className="btn btn-icon btn-light btn-hover-danger btn-sm"
              >
                <span className="svg-icon svg-icon-md svg-icon-danger">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                  />
                </span>
              </a>
            </div>
          );
        }

        //
      },

      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
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

  const click = (v) => {
    // setOpen(!open);
    // console.log(v._id);
    history.push(`/photoGrapher_details?id=${v._id}`);
    // setRowID(v._id);
    // history.push({
    //   pathname: "/category_Edit",
    //   state: v._id,
    // });
    // setEdited(i);
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

  const fetchData = (page, limit, search, status) => {
    // console.log("body out");
    let body = {
      limit,
      page,
      search,
      isPhotographerVerified: status,
    };
    if (selectCat) body.categoryId = selectCat;
    ApiPost("/get_photographer", body)
      .then((res) => {
        console.log("res.data.data", res.data.data);
        setData(res?.data?.data?.photographer_data);
        settotalpage(res?.data?.data?.state?.page_limit);
        setcurrentpage(res?.data?.data?.state?.page);
        setpagesize(res?.data?.data?.state?.limit);
      })
      .catch(async (err) => {
        ErrorToast(err?.message);
      });
  };

  const handleonchnagestatus = (e) => {
    // console.log(e.target.value);
    console.log("statsiss....................................", e);
    setState(e);
    fetchData(currentpage, pagesize, searching, e);
  };

  const getGategory = async () => {
    await ApiGet("/category")
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
  }, [searching, selectCat]);

  useEffect(() => {
    getGategory();
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
                    onClick={() => history.push("/photographers")}
                  >
                    Photographers
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
              <h3 class="card-label">Photographers</h3>
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
                        <Dropdown onSelect={handleonchnagestatus}>
                          <Dropdown.Toggle
                            id="dropdown-basic"
                            className="text-capitalize"
                          >
                            {state}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item eventKey="approve">
                              Apporve
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="request">
                              Request
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="reject">
                              Reject
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>

                      <div class="col-md-4 my-2 my-md-0">
                        <select
                          name=""
                          id="kt_datatable_search_status"
                          className="form-control"
                          onChange={handleSelect}
                        >
                          <option value="">Select Category</option>
                          {category?.map((val) => (
                            <option value={val?._id}>{val?.name}</option>
                          ))}
                        </select>
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
