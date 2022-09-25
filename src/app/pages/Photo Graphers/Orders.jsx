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
  const [date, setDate] = useState()
  
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
        return <span className="text-danger">#{index + 1}</span>;
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
          return <div className="text-danger">Placed/Approved Pending</div>;
        } else if (row.orderStatus == 1) {
          return <div className="text-warning">Packed</div>;
        }else if (row.orderStatus == 2) {
          return <div className="" style={{color:"red"}}>Rejected</div>;
        }
        else if (row.orderStatus == 3) {
          return <div className="text-info">Shipping</div>;
        } else if (row.orderStatus == 4) {
          return <div className="text-primary">Delivered</div>;
        } else if(row.orderStatus == 5){
          return <div className="text-success">Returning</div>;
        }
        else if(row.orderStatus == 8){
          return <div className="text-success">Return</div>;
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
          <>
            {" "}
            <div
              className=" btn-primary p-2 "
              style={{ fontSize: "10px",textAlign:'center' }}
              onClick={()=>click(row)}
            >
              View
            </div>
          </>
        );
      },
    },
  ];

  const click = (v) => {
    let str = "?id=" + v._id;
    history.push({
      pathname: "/order?id="+v._id,
      // param:v._id,
      // search: str,
    });
  };

  // console.log("block", block);

  const handlesearch = (e) => {
    setsearching(e.target.value);
    fetchData(currentpage, pagesize,searching)
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

  const fetchData = async (page, limit, search, status, date) => {
    console.log("body out"); 

    let body = {
      page: page,
      limit: limit,
      search: search,
      
    }
    if(status) {
      body.statusFilter = parseInt(status)
    }
    if(date){
      console.log("hello")
      body.dateFilter = date
    }
  
   
    await ApiPost("/orders/get",body)
    .then((res) => {
      console.log("res",res);
      setData(res?.data?.data.ordersData)
      settotalpage(res?.data?.data?.state?.page_limit);
        setcurrentpage(res?.data?.data?.state?.page);
        setpagesize(res?.data?.data?.state?.limit);

    })
    .catch(async (err) => {
      console.log("error",err)
      ErrorToast(err?.message);
      setData([])
    });
    // setData(...data,arr);
  };


  // const apply = (event, picker) => {
  //   console.log(picker, event);

  //   setpicker(picker);
  //   setvalll(
  //     `${moment(picker.startDate._d).format("DD-MM-YYYY")}-${moment(
  //       picker.endDate._d
  //     ).format("DD-MM-YYYY")}`
  //   );
  //   console.log(moment(picker.startDate._d).format("YYYY-MM-DD"));
  // };
  // const cancel = (event, picker) => {
  //   console.log(picker, event);

  //   setpicker("");
  //   setvalll("");
  //   // console.log(moment(picker.startDate._d).format('YYYY-MM-DD'))
  // };

  const handleonchnagestatus = (e) => {
    // console.log(e.target.value);
    console.log("statsiss....................................", e.target.value);
    // if(e == 0) {
    //   setState("Processing")
    // }else if(e==1) {
    //   setState("Packed")
    // }else if(e==2) {
    //   setState("Rejected")      
    // }else if(e == 3) {
    //   setState("In Transit")
    // }else if(e==4) {
    //   setState

    // }else if(e ==5) {

    // }else if(e == 6) {

    // }else {
    //   setState("All")
    // }
    // setState(e);
    fetchData(currentpage, pagesize, searching, e.target.value);
  };

  const getOrders = async () => {
    await ApiPost("/orders/get")
      .then((res) => {
        console.log("res.data.data", res.data.data);
        setGategory(res?.data?.data);
      })
      .catch(async (err) => {
        ErrorToast(err?.message);
      });
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    fetchData(currentpage, pagesize, searching,"" , e.target.value)
  }

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
                  <a class="text-muted">Orders</a>
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
              <h3 class="card-label">ORDERS</h3>
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
                      <select
                          name=""
                          id="kt_datatable_search_status"
                          className="form-control"
                          onChange={handleonchnagestatus}
                        >
                          <option value="">Select Category</option>
                          <option value="0">Processing</option>
                          <option value="1">Packed</option>
                          <option value="2">Rejected</option>
                          <option value="3">In Transit</option>
                          <option value="4">Delivered</option>
                          <option value="5">Return</option>
                          <option value="6">Return Completed</option>
                         
                            {/* <option value="price">Price</option>
                            <option value="date">Date</option>
                            <option value="category">Category</option>
                            <option value="stock">Stocks</option> */}
                        
                        </select>

                         
                      </div>
                      <div className="col-md-3 my-2">
                        {/* <DateRangePicker onApply={apply} onCancel={cancel}>
                          <input
                            type="text"
                            className="form-control"
                            value={valll}
                            placeholder="Select Date Range"
                          />
                        </DateRangePicker> */}
                        <input type="date" className="form-control" placeholder="select date" value={date} onChange= {handleDateChange} />
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
