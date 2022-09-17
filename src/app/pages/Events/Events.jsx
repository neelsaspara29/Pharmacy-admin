import React, { useEffect, useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { FiEdit2 } from "react-icons/fi";
import { AiTwotoneDelete } from "react-icons/ai";
import { lighten, makeStyles } from "@material-ui/core/styles";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import moment from "moment";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import {
  ApiDelete,
  ApiGet,
  ApiPost,
  ApiUpload,
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
import { FaPen } from "react-icons/fa";
import { set } from "lodash";
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

let idx;

export default function Event() {
  const classes = useStyles();
  const history = useHistory();
  const [number, setNumber] = useState(1)
  const [status, setStatus] = React.useState("");
  const [data, setData] = React.useState([]);
  const [totalpage, settotalpage] = useState(0);
  const [currentpage, setcurrentpage] = useState(1);
  const [pagesize, setpagesize] = useState(10);
  const [searching, setsearching] = useState("");
  const [picker, setpicker] = React.useState("");
  const [delet, setDelet] = React.useState(false);
  const [add, setAdd] = React.useState(false);
  const [rowID, setRowID] = React.useState();
  const [imgUrl, setImgUrl] = React.useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventStartdate, setEventStartdate] = useState("");
  const [eventEnddate, setEventEnddate] = useState("");
  const [deletId, setDeletId] = useState("");
  const [update, setUpdate] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [view, setView] = useState(false);
  const [attendUser, setAttendUser] = useState([]);



  const theme = useTheme();
  const deletEventModleShow = (id) => {
    setDeletId(id);
    setDelet(!delet);
  };
  const deletEvent = async () => {
    console.log("isd", deletId);
    await ApiDelete(`/event/delete/${deletId}`)
      .then((res) => {
        console.log("res", res);
        setDelet(!delet);
        setDeletId("");
        SuccessToast("Event has been Successfully Deleted !!!");
        fetchData(1, 10);
      })
      .catch((err) => {
        console.log("err", err);
        ErrorToast("Event not deleted Due Some Problem");
      });
  };

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
    {
      dataField: "name",
      text: "Event",
      sort: true,
      formatter: (cell, row) => {
        console.log("row", row.image[0]);
        return (
          <div className="d-flex align-items-center">
            <div className="symbol symbol-50 symbol-light mr-4">
              {row?.image[0].split("/")[2] == "lh3.googleusercontent.com" ? (
                <img
                  src={
                    row?.image
                      ? row?.image
                      : "https://img.icons8.com/clouds/100/000000/user.png"
                  }
                  className="img-fluid w-50px"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <img
                  src={
                    row?.image[0]
                      ? row?.image[0]
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
                {row.name}
              </a>
            </div>
          </div>
        );
      },
    },
    {
      dataField: "from_date",
      text: "Start Date",
      sort: true,
      formatter: (cell, row) => {
        return <div>{moment(row?.startDate).format("DD-MM-YYYY")}</div>;
      },
    },
    {
      dataField: "to_date",
      text: "End Date",
      sort: true,
      formatter: (cell, row) => {
        return <div>{moment(row?.endDate).format("DD-MM-YYYY")}</div>;
      },
    },
    {
      dataField: "description",
      text: "EVENT DESCRIPTION",
      sort: "true",
      formatter: (cell, row) => {
        return <div>{row.description}</div>;
      },
    },

    {
      dataField: "action",
      text: "Actions",
      headerStyle: {
        display: "flex",
        // justifyContent: "center",
        // flexDirection: "column-reverse"
      },
      formatter: (cell, row) => {
        //
        return (
          <div className="d-flex justify-content-start">
            <a
              title="View customer"
              className="btn btn-primary  "
              onClick={() => handleviewmodle(row)}
            >
              View
            </a>
            <a
              title="Edit customer"
              className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
              onClick={() => {
                handleupdatemodle(row);
              }}
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
              onClick={() => deletEventModleShow(row._id)}
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
  ];
  // const atd_columd=[
  //   {
  //     dataField: "name",
  //     text: "Event Attendee Name",
  //     sort: true,
  //     formatter: (cell, row) => {
  //       console.log("row", row);
  //       return (
  //         <div className="d-flex align-items-center">
  //          user1
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     dataField: "name",
  //     text: "Event Attendee Name",
  //     sort: true,
  //     formatter: (cell, row) => {
  //       console.log("row", row);
  //       return (
  //         <div className="d-flex align-items-center">
  //          user1
  //         </div>
  //       );
  //     },
  //   },
  // ]

  const handleonchnagespagination = (e) => {
    fetchData(1, parseInt(e.target.value), status, searching);
  };
  const handleChange = (e, i) => {
    console.log(i);
    fetchData(i, pagesize, status, searching);
  };

  const imageChange = async (e) => {
    console.log(e);
    let file = e.target.files[0];
    let fileURL = URL.createObjectURL(file);
    file.fileURL = fileURL;
    let formData = new FormData();
    formData.append("image", file);
    await ApiUpload("upload/profile", formData)
      .then((res) =>
        setImgUrl((data) => {
          console.log(data);

          return [...data, res?.data?.data?.image];
        })
      )
      .catch((err) => console.log("res_blob", err));
    document.getElementById("inFile").value = "";
  };
  const addEvent = async () => {
    let body = {
      name: eventName,
      description: eventDescription,
      image: imgUrl,
      location: eventLocation,
      startDate: eventStartdate,
      endDate: eventEnddate,
    };
    console.log("body", body);
    // setFlag(0)
    if (
      eventName &&
      eventDescription &&
      eventEnddate &&
      eventStartdate &&
      eventLocation
    ) {
      await ApiPost("/event/add", body)
        .then((res) => {
          console.log(res);
          SuccessToast("Event Has Been Successfuly Added !!!");
          setAdd(!add);
          setEventName("");
          setEventDescription("");
          setEventEnddate("");
          setEventStartdate("");
          setEventLocation("");
          setImgUrl([]);
          fetchData(1, 10);
        })
        .catch((err) => ErrorToast("Event Add  Failed"));
    } else {
      ErrorToast("All Fields Require");
    }
  };
  const updateEvent = async () => {
    let body = {
      eventId: updateId,
      name: eventName,
      description: eventDescription,
      image: imgUrl,
      location: eventLocation,
      startDate: eventStartdate,
      endDate: eventEnddate,
    };
    console.log("body", body);
    // setFlag(0)
    if (
      eventName &&
      eventDescription &&
      eventEnddate &&
      eventStartdate &&
      eventLocation
    ) {
      await ApiPost("/event/update", body)
        .then((res) => {
          console.log("updatedddd", res);
          SuccessToast("Event Has Been Successfuly Updated !!!");
          setUpdate(!update);
          setEventName("");
          setEventDescription("");
          setEventEnddate("");
          setEventStartdate("");
          setEventLocation("");
          setImgUrl([]);
          fetchData(1, 10);
        })
        .catch((err) => ErrorToast("Event Add  Failed"));
    } else {
      ErrorToast("All Fields Require");
    }
  };
  const handleupdatemodle = (data) => {
    console.log(data);
    setUpdateId(data.id);
    setEventName(data.name);
    setEventStartdate(moment(data.startDate).format("yyyy-MM-DD"));
    setEventDescription(data.description);
    setEventEnddate(moment(data.endDate).format("yyyy-MM-DD"));
    setEventLocation(data.location);
    setImgUrl(data.image);
    setUpdate(!update);
  };
 const handleviewmodle=async(data)=>{
  setView(!view);
  console.log(data)
  await ApiPost('/event/get/participant',{eventId:String(data._id),isAttending:true}).then((data)=>{
    console.log(data.data.data)
     
    setAttendUser(data?.data?.data);


  })

 }
  const handlechangename = (e) => {
    setEventName(e.target.value);
  };
  const handlechangestartD = (e) => {
    setEventStartdate(e.target.value);
  };
  const handlechangedescription = (e) => {
    setEventDescription(e.target.value);
  };
  const handlechangeendD = (e) => {
    setEventEnddate(e.target.value);
  };
  const handlechangelocation = (e) => {
    setEventLocation(e.target.value);
  };
  const handleDletImgage = (url) => {
    console.log(url);
    console.log(imgUrl);
    let arr;
    arr = imgUrl.filter((data, index) => {
      return imgUrl.indexOf(url) != index;
    });
    setImgUrl(arr);
  };
  const imageeditchage= async (e)=>{
    console.log("start");
    let file = e.target.files[0];
    let fileURL = URL.createObjectURL(file);
    file.fileURL = fileURL;
    let formData = new FormData();
    formData.append("image", file);
    await ApiUpload("upload/profile", formData)
      .then((res) =>
        {
          let arr=imgUrl;
          // console.log(imgUrl[0]);
          console.log("new res",res?.data?.data?.image);
          // let index=arr.indexOf(idx);

          console.log("compare idx lastarr", idx, imgUrl)
          // console.log(index)
         arr[idx]=res?.data?.data?.image;
         console.log("new arr after change", arr);
         setImgUrl([...arr]);
         
        //  setNumber(number+ 1)
          
        }).catch((err) => console.log("res_blob", err));
        document.getElementById("editFile").value && (document.getElementById("editFile").value = "");
  }

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];
  const click = (v) => {
    setAdd(!add);
    console.log(v._id);
    setRowID(v);
  };

  

  const fetchData = async (page, limit) => {
    let body = {
      page,
      limit,
    };

    console.log("first", body);
    await ApiGet("/event/get", body)
      .then((res) => {
        console.log("get_booking", res.data.data);
        setData(res.data?.data);
        // settotalpage(res.data.data.state.page_limit);
        // setcurrentpage(res.data.data.state.page);
        // setpagesize(res.data.data.state.limit);
      })
      .catch(async (err) => {
        ErrorToast(err?.message);
      });
  };
  useEffect(() => {
    fetchData(currentpage, pagesize);
  }, []);

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
              <h3 className="card-label">Events</h3>
            </div>
            <div class="card-toolbar">
              <a
                class="btn btn-primary font-weight-bolder"
                onClick={() => {
                  setEventName("");
                  setEventDescription("");
                  setEventEnddate("");
                  setEventStartdate("");
                  setEventLocation("");
                  setImgUrl([]);
                  setAdd(!add);
                }}
              >
                Add Events
              </a>
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
              {/* <div className="d-flex justify-content-between  pt-10">
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
                <div className="my-2">
                  <div className="d-flex align-items-center pagination-drpdown">
                    <select
                      className="form-control pagination-drpdown1 dropdownPage"
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
              </div> */}
            </div>
          </div>

          <Modal
            show={delet}
            centered
            onHide={() => setDelet(!delet)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <span>
                Are you sure you want to delete this Event permanently?
              </span>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={() => setDelet(!delet)}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
                <> </>
                <button
                  type="button"
                  onClick={deletEvent}
                  className="btn btn-primary btn-elevate"
                >
                  Delete
                </button>
              </div>
            </Modal.Footer>
          </Modal>
          <Modal
            show={add}
            centered
            size="lg"
            onHide={() => setAdd(!add)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Body>
              <div className="col-lg-12">
                <Form.Group md="6">
                  <Form.Label>Add Event</Form.Label>
                </Form.Group>
              </div>
              <div class="card-body pt-9 pb-0 mx-0 px-0 ">
                <div className="mb-7 text-center d-flex flex-column align-center overflow-scroll">
                  <label className="position-relative  d-flex justify-content-center align-content-center">
               
                   {  imgUrl.length ? (
                      imgUrl.map( (imgUrl,index) => {
                        console.log("run")
                        console.log("caghvcjhzjh",imgUrl,"    ",data?.profile_image)
                        return (
                            <div
                              style={{
                                marginRight: "30px",
                                width: "135px",
                                height: "135px",
                                borderRadius: "12%",
                                background: "#f3f3f3",
                                position: "relative",
                              }}
                            >
                          {console.log('sashgv', imgUrl)}
                              <img
                                src={imgUrl}
                                alt="imgUrl"
                                className="editImg"
                                width={"130px"}
                                height={"130px"}
                                style={{ borderRadius: "12%" }}
                              />
                              <div>
                                <div
                                  className="cursor-pointer"
                                  style={{color:'#3699FF'}}
                                  onClick={()=>{idx=index;console.log("iside", index)}}
                                >
                                  <label htmlFor="editFile" role="button">
                                    <FiEdit2
                                      style={{
                                        position: "absolute",
                                        left: "-25px",
                                        top: 0,
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        padding: "6px",
                                        background: "transparent",
                                      }}
                                    ></FiEdit2>
                                  </label>
                                </div>
                                <div
                                  className="cursor-pointer"
                                  style={{ color: "#3699FF" }}
                                  onClick={() => handleDletImgage(imgUrl)}
                                >
                                  <AiTwotoneDelete
                                    style={{
                                      position: "absolute",
                                      top: "30px",
                                      left: "-25px",
                                      borderRadius: "50%",
                                      width: "30px",
                                      height: "30px",
                                      padding: "6px",
                                      background: "transparent",
                                    }}
                                  ></AiTwotoneDelete>
                                </div>
                              </div>
                            </div>
                          
                        );
                      })
                    ) : (
                    
                        <div
                          style={{
                            marginLeft: "22px",
                            width: "130px",
                            height: "130px",
                            borderRadius: "12%",
                            background: "#f3f3f3",
                            position: "relative",
                          }}
                        ></div>
                      
                    )}
                    <label
                      htmlFor="inFile"
                      className="shadow d-inline inFiles position-absolute   right-0"
                      role="button"
                    >
                      <div class="card-toolbar">
                        <a class="btn btn-primary font-weight-bolder">
                          Add Images
                        </a>
                      </div>
                    </label>
                  </label>
                  <input
                    type="file"
                    name="1"
                    id="inFile"
                    hidden
                    onChange={imageChange}
                  />
                  <input
                    type="file"
                    name="2"
                    id="editFile"
                    hidden
                    onChange={imageeditchage}
                  />
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Event Name</label>
                  <div class="col-lg-8">
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      onChange={handlechangename}
                      value={eventName}
                    />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">
                    Event description
                  </label>
                  <div className="col-lg-8">
                    <textarea
                      name="lastName"
                      className="form-control"
                      onChange={handlechangedescription}
                      value={eventDescription}
                    />
                    {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">
                    Event Location
                  </label>
                  <div className="col-lg-8">
                    <textarea
                      name="lastName"
                      className="form-control"
                      onChange={handlechangelocation}
                      value={eventLocation}
                    />
                    {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">StartDate</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input
                      type="date"
                      name="startdate"
                      className="form-control"
                      onChange={handlechangestartD}
                      value={eventStartdate}
                    />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">EndDate</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input
                      type="date"
                      name="startdate"
                      className="form-control"
                      onChange={handlechangeendD}
                      value={eventEnddate}
                    />
                  </div>
                </div>

                <div className="d-flex align-center justify-content-center">
                  <button
                    className="btn btn-primary float-center w-30"
                    onClick={addEvent}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={() => setAdd(!add)}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
                <> </>
              </div>
            </Modal.Footer>
          </Modal>
          <Modal
            show={update}
            centered
            size="lg"
            onHide={() => setUpdate(!update)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Body>
              <div className="col-lg-12">
                <Form.Group md="6">
                  <Form.Label>Update Event</Form.Label>
                </Form.Group>
              </div>
              <div class="card-body pt-9 pb-0 mx-0 px-0 ">
                <div className="mb-7 text-center d-flex flex-column align-center overflow-scroll" >
                  <label className="position-relative ">
               
                    {imgUrl.length ? 
                      imgUrl.map((img,index)=>{
                      
                  return   <><img
                        src={`${img ?img : data?.profile_image}`}
                        alt="imgUrl"
                        className="editImg mr-2"
                        width={"150px"}
                        height={"150px"}
                        style={{ borderRadius: "12%" }}
                      />
                      <div className="d-inline" onClick={()=>{idx=index}}>

                         <label
                      htmlFor="editFile"
                      className="shadow d-inline inFiles"
                      role="button"
                    >
                      <FaPen className="faPen w-10 h-10" />
                    </label>
                      </div>
                    </>
                    })
                     : (
                      <div
                        style={{
                          margin: "auto",
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          background: "#f3f3f3",
                        }}
                      ></div>
                    )}
                 
                  </label>
                  <input
                    type="file"
                    name=""
                    id="editFile"
                    hidden
                    onChange={imageeditchage}
                  />
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">Event Name</label>
                  <div class="col-lg-8">
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      onChange={handlechangename}
                      value={eventName}
                    />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">
                    Event description
                  </label>
                  <div className="col-lg-8">
                    <textarea
                      name="lastName"
                      className="form-control"
                      onChange={handlechangedescription}
                      value={eventDescription}
                    />
                    {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">
                    Event Location
                  </label>
                  <div className="col-lg-8">
                    <textarea
                      name="lastName"
                      className="form-control"
                      onChange={handlechangelocation}
                      value={eventLocation}
                    />
                    {/* <input type="textarea" name="lastName" className="form-control"  onChange={handleChange} /> */}
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">StartDate</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input
                      type="date"
                      name="startdate"
                      className="form-control"
                      onChange={handlechangestartD}
                      value={eventStartdate}
                    />
                  </div>
                </div>
                <div class="row mb-7">
                  <label class="col-lg-4 fw-bold text-muted">EndDate</label>
                  <div class="col-lg-8 d-flex align-items-center">
                    <input
                      type="date"
                      name="startdate"
                      className="form-control"
                      onChange={handlechangeendD}
                      value={eventEnddate}
                    />
                  </div>
                </div>

                <div className="d-flex align-center justify-content-center">
                  <button
                    className="btn btn-primary float-center w-30"
                    onClick={updateEvent}
                  >
                    Update Changes
                  </button>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={() => setUpdate(!update)}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
                <> </>
              </div>
            </Modal.Footer>
          </Modal>
          <Modal
            show={view}
            centered
            size="lg"
            onHide={() => setView(!view)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Body>
              <div className="col-lg-12">
                <Form.Group md="6">
                  <Form.Label>Event Participant</Form.Label>
                </Form.Group>
              </div>
                <ul>
              {

                attendUser.map((data)=>{
                  return <li className="p-4 border-bottom-1">
                  <img
                  src={
                    data.users[0].profile_image
                      ?  data.users[0].profile_image
                      : "https://img.icons8.com/clouds/100/000000/user.png"
                  }
                  className="img-fluid w-50px h-50px mr-2"
                  style={{ objectFit: "cover" }}
                />
                  
                  {data.users[0].firstName}</li>
                })
              }
                </ul>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={() => setView(!view)}
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
  );
}
