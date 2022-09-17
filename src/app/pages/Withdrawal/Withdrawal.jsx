import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { lighten, makeStyles } from "@material-ui/core/styles";
import {
  ApiPost,
} from "../../../helpers/API/ApiData";
import NoDataTable from "../../../common/noDataTable";
import Pagination from "@material-ui/lab/Pagination";
const columns = [
  {
    dataField: "Paypalid",
    text: "Paypal_ID",
    headerStyle: {
      textAlign:'center'
    },
    formatter: (cell, row) => {
      //
      return <div style={{textAlign:'center'}}>{row.paypalId}</div>;
    },
  },
  {
    dataField: "email",
    text: "Paypal Email",
    headerStyle: {
      textAlign:'center'
    },
    formatter: (cell, row) => {
      //
      return <div style={{textAlign:'center'}}>{row.paypalEmail|| 'Email Not Given'}</div>
    },
  },
  {
    dataField: "text",
    text: "price",
    headerStyle: {
      textAlign:'center'
    },
    formatter: (cell, row) => {
      //
      return <div style={{textAlign:'center'}}>{row.price}</div>
    },
  },
  {
    dataField: "status",
    text: "Status",
    headerStyle: {
      textAlign:'center'
    },
    formatter: (cell, row) => {
      
      return <div style={{textAlign:'center'}}>{row.withdrawStatus?'Completed':'Pending'}</div>;
    },

   
  },
];
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

function Withdrawal() {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [page,setPage]=useState(1);
    const [limit,setLimit]=useState(10)
    const [totalpage, settotalpage] = useState(0);
    const [currentpage, setcurrentpage] = useState(1);
    const [pagesize, setpagesize] = useState(10);
    async function getWithdrawHistory(page,limit) {
      await ApiPost("/get_all_withdrawals", {
        page,
        limit
      })
        .then(({ data }) => {
          console.log(data);
          settotalpage(data?.data?.state?.page_limit);
          setcurrentpage(data?.data?.state?.page);
          setData(data.data.withdraw_data);
          setpagesize(data?.data?.state?.limit);
        })
        .catch((err) => console.log(err));
    }
    function handleChange(e,i){
      setPage(i)
       getWithdrawHistory(i,limit)
    }
    function handleonchnagespagination(e){
      setLimit(parseInt(e.target.value));
        getWithdrawHistory(page,parseInt(e.target.value))
    }
    useEffect(() => {
      
      getWithdrawHistory(page,limit);
    }, []);
  return (
    <>
    <div
        class="content  d-flex flex-column flex-column-fluid  h-100"
        id="kt_content"
      >
        <div className={`card h-80  d-flex  ${classes.card}`}>
 <div className=" card-body">
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
              </div>
    </>
  )
}

export default Withdrawal