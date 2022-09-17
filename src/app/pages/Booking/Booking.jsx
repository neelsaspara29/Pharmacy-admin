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
import { HiOutlineChevronRight } from "react-icons/hi";
// import Post_Edit from "./Post_Edit";
import { useTheme } from "@material-ui/core";
import Input1 from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import { Select } from "antd";
// import View_Post from "./View_Post";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import NoDataTable from "../../../common/noDataTable";
import { log } from "async";
const { Option } = Select;

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

export default function Booking() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState("approve");
  const [status, setStatus] = React.useState("");
  const [state2, setState2] = React.useState(true);
  const [state3, setState3] = React.useState(false);
  // const [sort, setsort] = React.useState("byDate");
  const [modelStatus, setmodelStatus] = React.useState("approve");
  const [message, setmessage] = React.useState("");
  const [data, setData] = React.useState([]);
  const [totalpage, settotalpage] = useState(0);
  const [currentpage, setcurrentpage] = useState(1);
  const [pagesize, setpagesize] = useState(10);
  const [searchData, setsearchData] = React.useState([]);
  const [searching, setsearching] = useState("");
  const [valll, setvalll] = React.useState("");
  const [picker, setpicker] = React.useState("");
  const [modal, setModal] = React.useState(false);
  const [modal1, setModal1] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [user, setUser] = React.useState("");
  const [Id, setId] = React.useState();
  const [rowID, setRowID] = React.useState();
  const [Software, setSoftware] = useState([]);
  const [category, setCategory] = useState([]);
  const [changecategory, setChangeCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubCategory] = useState([]);
  const [changeSub_category, setChangeSub_Category] = useState("");
  const [Sub_categoryId, setSub_CategoryId] = useState("");
  const [softwareId, setSoftwareId] = useState("");
  const [changeSoftware, setChangeSoftware] = useState("");
  const [softwarearray, Setsoftwarearray] = useState([]);
  const theme = useTheme();

  const deleteBookingBtn = async (id) => {
    await ApiDelete(`/booking/delete_booking/${id}`)
      .then(res => { console.log('res', res); SuccessToast("Booking has been Successfully Deleted !!!"); fetchData(1, 10, "booking", "") })
      .catch(err => { console.log('err', err); ErrorToast("Booking not deleted") })
  }

  useEffect(() => {
    ApiGet("/category")
      .then((res) => {
        console.log(res.data.data);
        // setCategory(res?.data?.data?.menu_categories)
        setSoftware(res?.data?.data.software_categories);
      })
      .catch(async (err) => { });
  }, []);

  useEffect(() => {
    ApiGet("/category?home=true")
      .then((res) => {
        console.log("@@@@@@@@@@@@@", res?.data?.data?.menu_categories);
        setCategory(res?.data?.data?.menu_categories);
        // setSubCategory(res?.data?.data?.menu_categories?.menu_sub_categories)
      })
      .catch(async (err) => { });
  }, []);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
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
        return (
          <div
            className="d-flex align-items-center"
          // onClick={() => history.push(`/user_details?id=${row._id}`)}
          >
            <div className="symbol symbol-50 symbol-light mr-4">
              {/* <span className="symbol-label">
                <span className="svg-icon h-75 align-self-end"> */}
              {row?.user[0]?.profile_image?.split("/")[2] ==
                "lh3.googleusercontent.com" ? (
                <img
                  src={
                    row?.user[0]?.profile_image
                      ? row?.user[0]?.profile_image
                      : "https://img.icons8.com/clouds/100/000000/user.png"
                  }
                  className="img-fluid w-50px"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <img
                  src={
                    row?.user[0]?.profile_image
                      ? row?.user[0]?.profile_image
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
              <a className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                {row?.user[0]?.firstName} {row?.user[0]?.lastName}
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
      dataField: "from_date",
      text: "Start Date",
      sort: true,
      formatter: (cell, row) => {
        //
        return <div>{moment(row?.from_date).format("DD-MM-YYYY")}</div>;
      },
    },
    {
      dataField: "to_date",
      text: "End Date",
      sort: true,
      formatter: (cell, row) => {
        //
        return <div>{moment(row?.to_date).format("DD-MM-YYYY")}</div>;
      },
    },
    {
      dataField: "amount",
      text: "Total Amount",
      sort: true,
    },
    {
      dataField: "bookingStatus",
      text: "Status",
      sort: true,
      formatter: (cell, row) => {
        //
        return row?.bookingStatus === 0 ? (
          <span class="label label-lg label-light-primary label-inline">
            Pending
          </span>
        ) : row?.bookingStatus === 1 ? (
          <span class="label label-lg label-light-success label-inline">
            Accept
          </span>
        ) : row?.bookingStatus === 2 ? (
          <span class="label label-lg label-light-danger label-inline">
            Reject
          </span>
        ) : row?.bookingStatus === 3 ? (
          <span class="label label-lg label-light-primary label-inline">
            Active
          </span>
        ) : row?.bookingStatus === 4 ? (
          <span class="label label-lg label-light-primary label-inline">
            Submit
          </span>
        ) : (
          row?.bookingStatus === 5 && (
            <span class="label label-lg label-light-success label-inline">
              Complete
            </span>
          )
        );
      },
    },
    {
      dataField: "action",
      text: "Actions",
      headerStyle: {
        display: "flex",
        // justifyContent: "center",
        // flexDirection: "column-reverse",
      },
      formatter: (cell, row) => {
        //
        return (
          <div className="d-flex justify-content-start">
            <a
              title="Edit customer"
              className="btn btn-primary  "
              onClick={() => click(row)}
            >
              View
            </a>
            <a
              title="Edit customer"
              className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
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
              onClick={() => deleteBookingBtn(row._id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}

                />
              </span>
            </a>
          </div>
        );
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

  const onUpdate = async (e, id) => {
    console.log(e.target.checked);
    console.log(id);
    try {
      ApiGet(`/post/action?postId=${id}&isPostActive=${e.target.checked}`)
        .then((res) => {
          console.log("ressssssssssss", res);
          SuccessToast(res?.data?.message);
          fetchData(currentpage, pagesize, state);
        })
        .catch(async (err) => {
          console.log(err);
          if (err.status == 410) {
            let ext = await reftoken(
              "ApiGet",
              `/post/action?postId=${id}&isPostActive=${e.target.checked}`
            );
            SuccessToast(ext.data.message);
            fetchData(currentpage, pagesize);
          } else {
            ErrorToast(err.message);
          }
        });
    } catch (error) { }
    // }
  };

  const view = (v) => {
    console.log(v);
    setOpen2(!open2);
    setUser(v);
  };
  const handlesearch = (e) => {
    console.log(e.target.value);

    setsearching(e.target.value);
    fetchData(1, pagesize, status, e.target.value);
  };
  const handleonchnagespagination = (e) => {
    fetchData(1, parseInt(e.target.value), status, searching);
  };
  const handleChange = (e, i) => {
    console.log(i);
    fetchData(i, pagesize, status, searching);
  };

  const handleonchnagesort = (e) => {
    setStatus(e);
    // fetchData(currentpage, pagesize, state, searching, e, state2, categoryId, Sub_categoryId, softwareId);
  };
  console.log("category", category);
  console.log("subhasbdashdcs", Sub_categoryId);

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];
  const click = (v) => {
    setOpen(!open);
    console.log(v._id);
    setRowID(v);
    // history.push({
    //   pathname: "/category_Edit",
    //   state: v._id,
    // });
    // setEdited(i);
  };
  const openModal = () => {
    setRowID();
    setOpen(!open);
  };

  const deleteTheory = (v) => {
    ApiDelete("/post/" + v)
      .then((res) => {
        console.log(res);
        SuccessToast(res?.message);
        setData(
          data.filter(function (el) {
            return el._id != v;
          })
        );
      })
      .catch(async (err) => {
        if (err.status == 410) {
          let ext = await reftoken("ApiDelete", "/sub_category/" + v);
          console.log(ext);
          SuccessToast(ext.data.message);
          setData(
            data.filter(function (el) {
              return el._id != v;
            })
          );
          setsearchData(
            searchData.filter(function (el) {
              return el._id != v;
            })
          );
        } else {
          ErrorToast(err.message);
        }
      });
    setModal(!modal);
  };

  const apply = (event, picker) => {
    console.log(picker, event);

    setpicker(picker);
    setvalll(
      `${moment(picker.startDate._d).format("DD-MM-YYYY")}-${moment(
        picker.endDate._d
      ).format("DD-MM-YYYY")}`
    );
    console.log(moment(picker.startDate._d).format("YYYY-MM-DD"));
  };
  const cancel = (event, picker) => {
    console.log(picker, event);

    setpicker("");
    setvalll("");
    // console.log(moment(picker.startDate._d).format('YYYY-MM-DD'))
  };

  const fetchData = async (page, limit, bookingStatus, search) => {
    let body = {
      page,
      limit,
      // search,
    };
    if (status) {
      body.bookingStatus =
        status === "Pending"
          ? 0
          : status === "Reject"
            ? 2
            : status === "Active"
              ? 3
              : status === "Complete" && 5;
    }
    if (picker) {
      body.fromDate = moment(picker.startDate._d).format("YYYY-MM-DD");
      body.toDate = moment(picker.endDate._d).format("YYYY-MM-DD");
    }

    console.log("first", body);
    await ApiPost("/get_booking", body)
      .then((res) => {
        console.log("get_booking", res);
        setData(res.data?.data?.booking_data);
        settotalpage(res.data.data.state.page_limit);
        setcurrentpage(res.data.data.state.page);
        setpagesize(res.data.data.state.limit);
      })
      .catch(async (err) => {
        // if (err.status == 410) {
        //   let ext = await reftoken("ApiPost", "/post/admin_get_post", body);
        //   console.log(ext);
        //   // setData(ext.data.data.menu_categories);
        // } else {
        ErrorToast(err?.message);
        // }
      });
  };
  useEffect(() => {
    fetchData(currentpage, pagesize, status, searching);
  }, [status, picker]);

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
                  <a class="text-muted">Booking</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        class="content d-flex flex-column flex-column-fluid h-100"
        id="kt_content"
      >
        <div class="card card-custom">
          <div class="card-header flex-wrap border-0 pt-6 pb-0 w-100">
            <div class="card-title ">
              <h3 class="card-label">Booking</h3>
            </div>

            {/* <div class="card-toolbar">
              <div class="dropdown me-2 show">
                <div
                  class={`fillterDropDown dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim-up dropdown-menu-lg ${state3 ===
                    true && "show"}`}
                >
                  <a
                    title="Delete customer"
                    className="btn btn-icon btn-sm float-end m-3"
                    // onClick={() => setState3(!state3)}
                  >
                    <span className="svg-icon svg-icon-md" closeButton>
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/Navigation/Close.svg"
                        )}
                      />
                    </span>
                  </a>
                  <form>
                    <div class="tab-content">
                      <div
                        class="tab-pane active show p-8"
                        id="topbar_notifications_notifications"
                        role="tabpanel"
                      >
                        <div className="row" style={{ width: "104%" }}></div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div> */}
          </div>

          <div className={`card h-80  d-flex  ${classes.card}`}>
            {/* Body */}
            <div className=" card-body">
              <div class="mb-5">
                <div class="row align-items-center">
                  <div class="col-lg-12 col-xl-12">
                    <div class="row align-items-center">
                      {/* <div class="col-md-3 my-2">
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
                      </div> */}
                      <div className="col-md-3 my-2">
                        <Dropdown onSelect={handleonchnagesort}>
                          <Dropdown.Toggle id="dropdown-basic">
                            {status ? status : "Select Status"}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item eventKey="Pending">
                              Pending
                            </Dropdown.Item>

                            <Dropdown.Item eventKey="Reject">
                              Reject
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Active">
                              Active
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Complete">
                              Complete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>

                      <div className="col-md-3 my-2">
                        <DateRangePicker onApply={apply} onCancel={cancel}>
                          <input
                            type="text"
                            className="form-control"
                            value={valll}
                            placeholder="Select Date Range"
                          />
                        </DateRangePicker>
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
                defaultSorted={defaultSorted}
                noDataIndication={() => <NoDataTable />}
              // filter={filterFactory()}
              // headerClasses="header-class"
              />
              <div class="d-flex justify-content-between  pt-10">
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
                <div class="my-2">
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
            <Post_Edit
              open={open}
              setOpen={setOpen}
              rowID={rowID}
              setRowID={setRowID}
              fetchDatas={fetchData}
              SetState={setState}
              currentpage={currentpage}
              pagesize={pagesize}
              state={state}
              searching={searching}
              sort={sort}
            />
          )} */}
          <Modal
            show={modal}
            centered
            onHide={() => setModal(!modal)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <span>
                Are you sure you want to delete this Post permanently?
              </span>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={() => setModal(!modal)}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
                <> </>
                <button
                  type="button"
                  onClick={() => deleteTheory(Id)}
                  className="btn btn-primary btn-elevate"
                >
                  Delete
                </button>
              </div>
            </Modal.Footer>
          </Modal>
          <Modal
            show={open}
            centered
            size="lg"
            onHide={() => setOpen(!open)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Body>
              <div className="col-lg-12">
                <Form.Group md="12">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="textarea"
                    placeholder="Enter Message...."
                    label="message"
                    id="message"
                    required
                    name="message"
                    value={rowID?.description}
                  />
                </Form.Group>
              </div>
              {rowID?.bookingStatus === 4 && (
                <div className="col-lg-12">
                  <Form.Group md="12">
                    <Form.Label>Images</Form.Label>
                    <div className="grid-container">
                      {rowID?.image.map((img) => (
                        <div className="grid-item">
                          <img
                            className="rounded m-2"
                            width={"150px"}
                            height={"100px"}
                            src={img}
                          />
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
                <> </>
              </div>
            </Modal.Footer>
          </Modal>
          {/* {open2 && <View_Post open2={open2} setOpen2={setOpen2} user={user} />} */}
        </div>
      </div>
    </>
  );
}
