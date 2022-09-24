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
import Axios from "axios";
// import moment from "moment";
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

export default function Inventory_List() {
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
      dataField: "medicine name",
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
                {row?.name}
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
      dataField: "In Stock",
      text: "In Stock",
      sort: true,
      formatter:(cell, row) => {
        return (
            <div
            className="d-flex align-items-center"
          // onClick={() => history.push(`/user_details?id=${row._id}`)}
          >
            
            <div>
              <a className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg" onClick={() => click(row)}>
                {row?.stocks}
              </a>
            </div>
          </div>
        )
      }
    },
    {
      dataField: "mrp",
      text: "mrp",
      sort: true,
      formatter:(cell, row) => {
        return (
            <div
            className="d-flex align-items-center"
          // onClick={() => history.push(`/user_details?id=${row._id}`)}
          >
            
            <div>
              <a className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg" onClick={() => click(row)}>
                {row?.mrp}
              </a>
            </div>
          </div>
        )
      }
    },
    {
      dataField: "ptr",
      text: "ptr",
      sort: true,
      formatter:(cell, row) => {
        return (
            <div
            className="d-flex align-items-center"
          // onClick={() => history.push(`/user_details?id=${row._id}`)}
          >
            
            <div>
              <a className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg" onClick={() => click(row)}>
                {row?.ptr}
              </a>
            </div>
          </div>
        )
      }
    },
    {
      dataField: "scheme",
      text: "scheme",
      sort: true,
      formatter:(cell, row) => {
        return (
            <div
            className="d-flex align-items-center"
          // onClick={() => history.push(`/user_details?id=${row._id}`)}
          >
            
            <div>
              <a className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg" onClick={() => click(row)}>
                {row?.Scheme}
              </a>
            </div>
          </div>
        )
      }
    },
    {
      dataField: "gst",
      text: "gst",
      sort: true,
      formatter:(cell, row) => {
        return (
            <div
            className="d-flex align-items-center"
          // onClick={() => history.push(`/user_details?id=${row._id}`)}
          >
            
            <div>
              <a className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg" onClick={() => click(row)}>
                5%
              </a>
            </div>
          </div>
        )
      }
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
      let body = {
        data: d
      }
      // setItems(d);
      console.log("data", d)
      await ApiPost("/inventory/update", body)
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

  const handleGetInventory = async () => {
    await ApiGet("/inventory/download")
    .then((res) => {
      console.log(res.data.data)
      window.location.href = res.data.data
      // fetch(res.data.data).then(() => {
      //   console.log("success")
      // })
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
  }

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

    await ApiPost("/medicine/get", body)
      .then((res) => {
        console.log(res.data.data)
        setData(res?.data?.data?.medicinesData);
        // console.log(res.data.data.retailersData[0].createdAt)
        // console.log(moment(res.data.data.retailersData[0].createdAt).format('L'))
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
                    Inventory
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
              <h3 class="card-label">Inventory</h3>
            </div>
            <div className="card-toolbar">

            <div class="card-toolbar">
              <a
                class="btn btn-primary font-weight-bolder"
                onClick={handleGetInventory}
              >
                Get Inventory
              </a>
            </div>
            <div  class="card-toolbar ms-2">
             <input
        type="file"
        id="csvFile"
        // style={{visibility: "hidden"}}
        hidden
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      /> 
        <label htmlFor="csvFile" className="m-0">

              <a
                class="btn btn-primary font-weight-bolder"
                // onClick={() => setOpen(true)}
              >
                Upload Inventory
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
