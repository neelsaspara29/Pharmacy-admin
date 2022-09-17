import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {  makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import {
  ApiPost,
} from "../../../helpers/API/ApiData";
import NoDataTable from "../../../common/noDataTable";
import Pagination from "@material-ui/lab/Pagination";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";

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

function Report() {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [page,setPage]=useState(1);
    const [limit,setLimit]=useState(10)
    const [totalpage, settotalpage] = useState(0);
    const [currentpage, setcurrentpage] = useState(1);
    const [pagesize, setpagesize] = useState(10);

    const history=useHistory();

    // COLOM DEFINATION FOR BOOTSTRAP DATATABLE
    const columns = [
      {
        dataField: "Reported By",
        text: <h4>Reported By</h4>,
        headerStyle: {
          textAlign:'center',
        },
        formatter: (cell, row) => {
          return ( <div
            className="d-flex align-items-center"
          >
            <div className="symbol symbol-50 symbol-light mr-4">
              {row?.reportedBy?.profile_image?.split("/")[2] ==
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
                    row?.reportedBy?.profile_image
                      ? row?.reportedBy?.profile_image
                      : "https://img.icons8.com/clouds/100/000000/user.png"
                  }
                  className="img-fluid w-50px"
                  style={{ objectFit: "cover" }}
                />
              )}
              
            </div>
            <div>
              <a className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
            {  row.reportedBy.email}
              </a>
            </div>
          </div>)
        },
      },
      {
        dataField: "Message",
        text: <h4>Message</h4>,
        headerStyle: {
          textAlign:'center'
        },
        formatter: (cell, row) => {
          return <div style={{textAlign:'center',maxWidth:"400px",maxHeight:'300px',overflowY:'scroll',alignItems:'center',margin:'auto'}}>{row.message|| 'Email Not Given'}</div>
        },
      },
      {
        dataField: "Reported To",
        text: <h4>Reported To/ID</h4>,
        headerStyle: {
          textAlign:'center',
          
        },
        formatter: (cell, row) => {
          return <div style={{textAlign:'center'}}>{row.reportedTo.firstName} || <span style={{color:'blue',cursor:'pointer'}} onClick={()=>{handleRedirect(row.reportedTo._id)}}> {row.reportedTo._id} </span></div>
        },
      },
      {style:{
        overflow:'hidden'
      }}
      
    ];
    // COLOM DESCRIPTION END HERE

     
     function handleRedirect(id){
      history.push(`/photoGrapher_details?id=${id}`);
     }
    async function getReports(page,limit) {
      await ApiPost("/get/allReports", {
        page,
        limit
      })
        .then(( data ) => {
          settotalpage(data?.data?.data?.state?.page_limit);
          setcurrentpage(data?.data?.data?.state?.page);
          setData(data.data.data.report_data);
          setpagesize(data?.data?.data?.state?.limit);
        })
        .catch((err) => console.log(err));
    }
    function handleChange(e,i){
     setPage(i)
      getReports(i,limit)
   }
   function handleonchnagespagination(e){
    setLimit(parseInt(e.target.value))
    getReports(page,parseInt(e.target.value))
   }
    
    useEffect(() => {
      getReports(page,limit);
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
        keyField="id"
        data={data}
        columns={columns}
        noDataIndication={() => <NoDataTable />}
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

export default Report