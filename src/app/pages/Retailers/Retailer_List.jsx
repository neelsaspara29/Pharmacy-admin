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
import * as XLSX from "xlsx";
import Retailer_Edit from "./Retailer_Edit.jsx";
// import moment from "moment";

let fstate = ["Pending", "Approve", "Block", "All Data"]
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

let firstSearch = true

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
  const [filterState, SetFilterState] = useState(3)

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
      dataField: "status",
      text: "STATUS",
      sort: true,
      formatter: (cell, row) => {
        console.log("status", row.status)
        if (row.status == 0) {
          return <div className="text-primary">Pending</div>;
        } else if (row.status == 1) {
          return <div className="text-success">Approve</div>;
        } else {
          return <div className="text-danger">Block</div>;
        }
      },
    },
    {
      dataField: "Joining date",
      text: "joining date",
      sort: true,
      formatter: (cell, row) => {
        return (
          <div>{moment(row.createdAt).format('L')}</div>
        )
      }
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
                className="btn  btn-primary btn-hover-danger btn-sm me-3"
                onClick={() => click(row)}
              >
                <span className="svg-icon svg-icon-md svg-icon-primary">
                  View
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

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        
        const wsname = wb.SheetNames[0];
        
        const ws = wb.Sheets[wsname];
        
        const data = XLSX.utils.sheet_to_json(ws);
        
        console.log("data neel", data)
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then(async (d) => {
      // setItems(d);
      console.log("data", d)
      let body = {data : d}
      await ApiPost("/retailers/bulk/add", body)
      .then((res) => {
        console.log(res)
    fetchData(currentpage, pagesize, searching);

        SuccessToast(res.data.message)
        // setData(res?.data?.data?.medicinesData);
        // console.log(res.data.data.retailersData[0].createdAt)
        // console.log(moment(res.data.data.retailersData[0].createdAt).format('L'))
        // settotalpage(res?.data?.data?.state?.page_limit);
        // setcurrentpage(res?.data?.data?.state?.page);
        // setpagesize(res?.data?.data?.state?.limit);
      })
      .catch(async (err) => {
        ErrorToast(err?.message);
      });
    });
  };

  const handlesearch = (e) => {
    setsearching(e.target.value);
    fetchData(currentpage, pagesize, e.target.value);
  };
  const handleonchnagespagination = (e) => {
    fetchData(1, parseInt(e.target.value), searching);
  };
  const handleChange = (e, i) => {
    fetchData(i, pagesize, searching);
  };

  const fetchData = async (page, limit, search, status) => {
    let body = {
      limit,
      page,
      search,
      status: parseInt(status)
    };

    await ApiPost("/retailers/get", body)
      .then((res) => {
        setData(res?.data?.data?.retailersData);
        console.log(res.data.data.retailersData[0].createdAt)
        console.log(moment(res.data.data.retailersData[0].createdAt).format('L'))
        settotalpage(res?.data?.data?.state?.page_limit);
        setcurrentpage(res?.data?.data?.state?.page);
        setpagesize(res?.data?.data?.state?.limit);
        firstSearch = true
      })
      .catch(async (err) => {
        if(firstSearch) {
          ErrorToast(err?.message);

          firstSearch = false
        }
        setData([])
      });
  };
  // console.log("resresresresresresresresresresres", data);

  const handleChangeStatus = (e) => {

    SetFilterState(e)
    if(e != "3"){
    fetchData(currentpage, pagesize, searching, e);
    }else {
      // console.log(3)
    fetchData(currentpage, pagesize, searching);

    }
  }

  const getFomat = () => {
    window.location.href = "https://healthsarv.s3.ap-south-1.amazonaws.com/add-retailer-data.csv"
  }

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
                    Retailers
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
              <h3 class="card-label">Retailers</h3>
            </div>
            <div className="card-toolbar">

            <div class="card-toolbar">
              <a
                class="btn btn-primary font-weight-bolder"
                onClick={() => setOpen(true)}
              >
                Add Retailer
              </a>
            </div>
            <div class="card-toolbar ms-2">
              <a
                class="btn btn-primary font-weight-bolder"
                onClick={getFomat}
              >
                Download Format
              </a>
            </div>
            <div class="card-toolbar ms-2">
             <input
        type="file"
        // style={{visibility: "hidden"}}
        id="userFile"
        hidden
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      /> 
            <label htmlFor="userFile" className="m-0">
              <a
                class="btn btn-primary font-weight-bolder"
                // onClick={() => setOpen(true)}
              >
                Upload Retailer Data
              </a>
              </label>
            </div>
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
                        <Dropdown onSelect={handleChangeStatus} >
                          <Dropdown.Toggle
                            id="dropdown-basic"
                            className="text-capitalize"
                          >
                            {fstate[filterState]}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item eventKey="3">
                              All Data
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="1">
                              Approved
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="2">
                              Block
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="0">
                              Pending
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
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
          {open && (
            <Retailer_Edit
              open={open}
              setOpen={setOpen}
              fetchDatas={fetchData}
              currentpage = {currentpage}
              pagesize = {pagesize} 
              searching = {searching}

            />
          )}
        </div>
      </div>
    </>
  );
}
