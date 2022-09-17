import React, { useEffect, useState } from 'react'
import { ApiGet, ApiGetNoAuth, ApiGet_admin } from '../../../helpers/API/ApiData';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core';
import { Modal } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import moment from "moment";
import NoDataTable from '../../../common/noDataTable';
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



function QandA() {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false)
  const [answer, setAnswer] = useState([])

  

  const columns = [
    {
      dataField: "text",
      text: "QuestionBy",
      sort: true,
      formatter: (cell, row) => {
        console.log("row", row);
        return (
          <div className="d-flex align-items-center">
          <div className="symbol symbol-50 symbol-light mr-4">
            {row?.questionBy.profile_image.split("/")[2] == "lh3.googleusercontent.com" ? (
              <img
                src={
                  row?.questionBy.profile_image
                    ? row?.questionBy.profile_image
                    : "https://img.icons8.com/clouds/100/000000/user.png"
                }
                className="img-fluid w-50px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <img
                src={
                  row?.questionBy.profile_image
                    ? row?.questionBy.profile_image
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
              {row.questionBy.firstName +" "+row.questionBy.lastName}
            </a>
          </div>
        </div>
        );
      },
    },
    {
      dataField: "ftext",
      text: "Question",
      sort: true,
      formatter: (cell, row) => {
        return <div>{row.question}</div>;
      },
    },
    {
      dataField: "date",
      text: "Time",
      sort: true,
      formatter: (cell, row) => {
        return <div>{moment(row?.createdAt).format("DD-MM-YYYY")}</div>;
      },
    },
   
  
    {
      dataField: "action",
      text: "Actions",
      headerStyle: {
        display: "flex",
   
      },
      formatter: (cell, row) => {
        //
        return (
          <div className="d-flex justify-content-start">
            <a
              title="View customer"
              className="btn btn-primary  "
              onClick={() => handleviewmodle(row._id)}
            >
              View
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
  ]; 

  const answer_colmn=[
    {
      dataField: "text",
      text: "AnswerBy",
      sort: true,
      formatter: (cell, row) => {
        console.log("row", row);
        return (
          <div className="d-flex align-items-center">
          <div className="symbol symbol-50 symbol-light mr-4">
            {row?.user[0].profile_image.split("/")[2] == "lh3.googleusercontent.com" ? (
              <img
                src={
                  row?.user[0].profile_image
                    ? row?.questionBy.profile_image
                    : "https://img.icons8.com/clouds/100/000000/user.png"
                }
                className="img-fluid w-50px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <img
                src={
                  row?.user[0].profile_image
                    ? row?.user[0].profile_image
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
              {row.user[0].firstName +" "+row.user[0].lastName}
            </a>
          </div>
        </div>
        );
      },
    },
    {
      dataField: "ftext",
      text: "Answer",
      sort: true,
      formatter: (cell, row) => {
        return <div>{row.answer}</div>;
      },
    },
    {
      dataField: "date",
      text: "Time",
      sort: true,
      formatter: (cell, row) => {
        return <div>{moment(row?.createdAt).format("DD-MM-YYYY")}</div>;
      },
    },
  ]

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];

  const classes = useStyles();
  const history=useHistory();


 async function handleviewmodle(id){
    setShow(!show);
    await ApiGet_admin(`user/get/answer/${id}`).then((data)=>{
      console.log(data);
      setAnswer(data.data.data)
    })
  }
  const fetchData=async()=>{
    await  ApiGet_admin('user/get/allQuestions').then((data)=>{
      setData(data?.data?.data);
      console.log(data)
    }
      );
  }
 

    useEffect(() => {
        fetchData();
    }, [])
    
  return (
   <>
  <div
        className="subheader py-2 py-lg-6  subheader-transparent "
        id="kt_subheader"
      >
        <div className=" container  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
          <div className="d-flex align-items-center flex-wrap mr-1">
            <div className="d-flex align-items-baseline flex-wrap mr-5">
              <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                <li className="breadcrumb-item">
                  <a
                    className="text-muted"
                    onClick={() => history.push("/dashboard")}
                  >
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a className="text-muted">Events</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        className="content d-flex flex-column flex-column-fluid h-100"
        id="kt_content"
      >
        <div className="card card-custom">
          <div className="card-header flex-wrap border-0 pt-6 pb-0 w-100">
            <div className="card-title ">
              <h3 className="card-label">Discussion </h3>
            </div>
            
          </div>

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
                defaultSorted={defaultSorted}
                noDataIndication={() => <NoDataTable />}
              />
              
            </div>
          </div>

          <Modal
            show={show}
            centered
            size="lg"
            onHide={() => setShow(!show)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Body>
            <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                keyField="id"
                data={answer}
                columns={answer_colmn}
                defaultSorted={defaultSorted}
                noDataIndication={() => <NoDataTable />}
              />
              
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
                <> </>
              </div>
            </Modal.Footer>
          </Modal>
         
        </div>
      </div>
   </>
  )
}

export default QandA;