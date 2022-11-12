import React, { useEffect, useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { lighten, makeStyles } from "@material-ui/core/styles";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import moment from "moment";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { validationMedicineData } from "../../../_metronic/_helpers/validationHelper";
import DropdownButton from "react-bootstrap/DropdownButton";
// const data2 = ["sassasassas","aaaassfsfsf", "dsdsdsdsdsd","cdcdcddccd"];


import {
  ApiDelete,
  ApiGet,
  ApiPost,
  ApiPostNoAuth,
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
// import { Modal } from "react-bootstrap";
import { HiOutlineChevronRight } from "react-icons/hi";
// import User_Edit from "./User_Edit";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import NoDataTable from "../../../common/noDataTable";
import { retry } from "async";
import { BorderStyle } from "@material-ui/icons";
import { data } from "jquery";
import MedicineEdit from "./MedicineEdit";
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

const mname = ["Premium Medicare","Pharma Art", "Optimum Healthcare", "Quick Health Remedies", "Diligent Health Solutions", "Noble Pharmaceuticals", "Healthy Life Medicare", "Perfect Pharma Solutions", "Wellness Pharma", "Good Health Pharmaceuticals"]

let firstSearch = true;


export default function User_List() {
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
  const [modalState, setModalState] = useState(1);
  const [category, setCategory] = useState([]);
  const [addData, setAddData] = useState({
    name: "",
    description: "",
    mainImage: "",
    images: [],
    manufacturerName: "",
    pack: "",
    ptr: "",
    stocks: "",
    mrp: "",
    marginalDiscount: "",
    Scheme: "",
    chemicalComposition: "",
    hsnCode: "",
    category: "",
    tags: "",
    ShortDesc: "",
    status:""
  });
  const [catArr, setCatArr] = useState([]);
  const [tagArr, setTagArr] = useState([]);
  const [mainImg, setMainImg] = useState();
  const [gimages, setGimages] = useState([]);
  const [MainData, setMainData] = useState([]);
  const [sorted, setSorted] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState([]);
  const [delet, setDelet] = useState(false);
  const [deletId, setDeletId] = useState("");
  const [isPrev, setIsPrev] = useState(false);
  const [mnameSuggestion, setMnameSuggestion] = useState([])
  
  const deletMedicine = async () => {
    await ApiDelete(`/medicine/${deletId}`)
      .then((res) => {
        console.log(res);
        SuccessToast("User has been Successfully Deleted !!!");
        fetchData(1, 10, "");
        setDelet(!delet);
      })
      .catch((err) => {
        console.log("err_deleteUser", err);
        ErrorToast("user Not Deleted");
      });
  };
  const click = (v) => {
    // history.push(`/user_details?id=${v._id}`);
  };
  const columns = [
    {
      dataField: "_id",
      text: "ID",
      sort: true,
      formatter: (cell,row,index) => {
        console.log(cell,row,index);
        return <span className="text-danger">#{row?.batchNo}</span>;
      },
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      formatter: (cell, row) => {
        console.log("row", cell);
        return (
          <div className="d-flex align-items-center">
            <div className="symbol symbol-50 symbol-light mr-4">
              <img
                src={
                  row.mainImage
                    ? row.mainImage
                    : "https://img.icons8.com/clouds/100/000000/user.png"
                  }
                  width={30}
                  height={30}
                className="img-fluid"
                style={{ objectFit: "cover",width:'30px',height:'30px' }}
              />
            </div>
            <div>
              <a
                className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg"
                onClick={() => click(row)}
              >
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
      dataField: "stocks",
      text: "STOCK",
      sort: true,
      formatter: (cell, row) => {
        if (row.stocks != 0) {
          return <div className="text-success">In Stocks</div>;
        } else {
          return <div className="text-danger">Out Of Stocks</div>;
        }
      },
    },
    {
      dataField: "mrp",
      text: "PRICE",
      sort: true,
    },
    {
      dataField: "createdAt",
      text: "CREATED AT",
      sort: true,
      formatter: (cell, row) => {
        
        return <div>{moment(row.createdAt).format("DD/MM/YYYY")}</div>
      },
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
                onClick={() => {
                  setEditModal(!editModal);
                  setEditData(row)
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
                onClick={() => {
                  setDelet(!delet);
                  setDeletId(row._id);
                }}
              >
                <span className="svg-icon svg-icon-md svg-icon-danger">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                  />
                </span>
              </a>
            </div>
          </div>
        );
      },
    },
  ];

  // console.log("block", block);

  const handlesearch = (e) => {
    setsearching(e.target.value);
    fetchData(currentpage, pagesize, e.target.value);
  };
  const handleonchnagespagination = (e) => {
    fetchData(1, parseInt(e.target.value), searching);
  };


  const getSuggestion = (v) => {
    if(v) {

      const result = mname.filter(item => item.toLowerCase().includes(v) )
      console.log(result)
      setMnameSuggestion(result)
    }else {
      setMnameSuggestion([])
    }
  }

  const onMnameSuggestionClick = (v) => {
    setAddData((data) => {
      return { ...data, ["manufacturerName"]: v };
    });
    setMnameSuggestion([])
  }

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if(name == "manufacturerName") {
      getSuggestion(value)
    }else {
      setMnameSuggestion([])
    }
    setAddData((data) => {
      return { ...data, [name]: value };
    });
  };

  const handlePageChange = (e, i) => {
    fetchData(i, pagesize, searching);
  }
  


  const handleAddMedicineSubmit = async () => {
    let body = addData;
    body.category = catArr;
    body.tags = tagArr;
    body.mainImage = mainImg;
    body.images = gimages;
    console.log(body);
    let res = validationMedicineData(body);

    if (res == true) {
    
      console.log(body);
      await ApiPost("/medicine/add", body).then((res) => {
        console.log(res);
        
        setModal(!modal);
        fetchData(1, 10);
      });
    } else {
      ErrorToast(res.res);
      setModalState(res.state);
    }
  };
  const handleCatchange = (e) => {
   
    const category_show = document.getElementById("category_show");
    if (e.target.value != "Select Category")
      category_show.innerHTML += `<span class='p-2 bg-light m-2'>${e.target.value}</span>`;
    setCatArr([...catArr,e.target.options[e.target.selectedIndex].dataset.id]);
  };
  const handleTagShow = (e) => {
    const tags_show = document.getElementById("tags_show");
    if (e.key == "Enter") {
      tags_show.innerHTML += `<span class='p-2  bg-success m-2'># ${e.target.value}</span>`;
      setTagArr([...tagArr, e.target.value]);
      setAddData({ ...addData, tags: "" });
    }
  };
  const imageMainhandle = async (e) => {
    const mainimage = document.getElementById("mainimage");
    const files = e.target.files[0];
    const name = e.target.name;
    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.addEventListener("load", async function() {
        mainimage.style.display = "block";

        setAddData({ ...addData, [name]: this.result });
        mainimage.innerHTML =
          '<img src="' + this.result + '" width=160px  height=140px />';

        let file = files;
        let fileURL = URL.createObjectURL(file);
        file.fileURL = fileURL;
        let formData = new FormData();
        formData.append("image", file);
        await ApiUpload("upload/profile", formData)
          .then((res) => {
            setMainImg(res.data.data.image);
          })
          .catch((err) => console.log("res_blob", err));
      });
    }
  };
  const imageGallaryhandle = async (e) => {
    let img_array = e.target.files;
    const gallaryimage = document.getElementById("gallaryimage");
    gallaryimage.style.display = "block";
    if (gallaryimage.innerHTML == "Click To Add Image")
      gallaryimage.innerHTML = "";
    let temp = [];
    let array = [];
    for (let i = 0; i < img_array.length; i++) {
      gimages.push(e.target.files[i]);
      if (img_array[i]) {
        temp.push(e.target.files[i]);
        const fileReader = new FileReader();
        fileReader.readAsDataURL(img_array[i]);
        fileReader.addEventListener("load", function() {
          array.push(this.result);
          gallaryimage.innerHTML +=
            '<img className=mr-2 src="' +
            this.result +
            '" width=160px  height=140px />';
        });
      }
    }
    setAddData({ ...addData, [e.target.name]: array });

    let temp_1 = [];
    for (let i = 0; i < temp.length; i++) {
      let file = temp[i];
      let fileURL = URL.createObjectURL(file);
      file.fileURL = fileURL;
      let formData = new FormData();
      formData.append("image", file);
      await ApiUpload("upload/profile", formData)
        .then((res) => {
          temp_1.push(res.data.data.image);
        })
        .catch((err) => console.log("res_blob", err));
    }
    setGimages(temp_1);
  };

  const handleSelectOrder = (e) => {
    let name = e.target.value;
    if (sorted == 1 && name == "Decreasing") {
      let temp = data;
      temp.reverse();
      setData([...temp]);
      setSorted(2);
    } else if (sorted == 2 && name == "Increasing") {
      let temp = data;
      temp.reverse();
      setData([...temp]);
      setSorted(1);
    }
  };
  const hide = () => {
    setEditModal(!editModal);
  };

  const fetchData = async (page, limit, search, cid) => {
    let body = {
      search,
      page,
      limit,
    };
    if (cid) {
      body.categories = [cid];
    }

    await ApiPost("/medicine/get", body)
      .then((res) => {
        console.log(res?.data?.data);
        setData(res?.data?.data?.medicinesData);
        setMainData(res?.data?.data?.medicinesData);
        settotalpage(res?.data?.data?.state?.page_limit);
        setcurrentpage(res?.data?.data?.state?.page);
        setpagesize(res?.data?.data?.state?.limit);
        firstSearch = true;
      })
      .catch(async (err) => {
        if (firstSearch) {
          ErrorToast(err?.message);
          firstSearch = false;
        }
        setData([]);
      });

    // setData(arr);
    // setMainData(arr);
    // setData([...data,

    // ]);
  };

  const handleSelectCategory = (e) => {
    console.log(e.target.value);
    fetchData(currentpage, pagesize, searching, e.target.value);
  };
  const fetchCategory = async () => {
    await ApiPost("/category/get").then((res) => {
      setCategory(res.data.data);
    });
  };

  // console.log("resresresresresresresresresresres", data);
  useEffect(() => {
    fetchData(currentpage, pagesize, searching);
    fetchCategory();
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
                    Medicines
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
              <h3 class="card-label">Medicines</h3>
            </div>
            <div class="card-toolbar">
              <a
                class="btn btn-primary font-weight-bolder"
                onClick={() => setModal(true)}
              >
                Add Medicine
              </a>
            </div>
          </div>

          <div className={`card h-80  d-flex  ${classes.card}`}>
            {/* Body */}
            <div className=" card-body">
              <div class="mb-5">
                <div class="row align-items-center">
                  <div class="col-lg-9 col-xl-8">
                    <div class="row align-items-center w-100">
                      <div class="col-md-4 my-2  my-md-0">
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

                      <div class="col-md-4 my-2 my-md-0">
                        <select
                          name=""
                          id="kt_datatable_search_status"
                          className="form-control"
                          onChange={handleSelectCategory}
                        >
                          <option value="">Select Category</option>
                          {category.map((item) => {
                            return (
                              <option value={item._id}>{item.name}</option>
                            );
                          })}

                          {/* <option value="price">Price</option>
                            <option value="date">Date</option>
                            <option value="category">Category</option>
                            <option value="stock">Stocks</option> */}
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
                    onChange={handlePageChange}
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
      </div>
      <div className="modal1">
        <Modal
          show={modal}
          centered
          size="lg"
          onHide={() => setModal(!modal)}
          aria-labelledby="example-modal-sizes-title-lg"
          contentClassName="modaldailog"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Medicine Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="overlay overlay-block cursor-default">
            {modalState == 1 && (
              <div className="form-group row">
                <div className="col-lg-12">
                  <Form.Group md="6">
                    <Form.Label>Batch No.</Form.Label>
                    <Form.Control
                      type="text"
                      id="validID"
                      label="BatchNo."
                      required
                      name="batchNo"
                      onChange={handleChange}
                      value={addData.batchNo}
                      placeholder="Batch Number"
                    />

                    <span className="errorInput"></span>
                  </Form.Group>
                  <Form.Group md="6">
                    <Form.Label>Medicine Name</Form.Label>
                    <Form.Control
                      type="text"
                      id="name"
                      label="Medicinename"
                      required
                      name="name"
                      onChange={handleChange}
                      value={addData.name}
                      placeholder="Name Of Medecine"
                    />

                    <span className="errorInput"></span>
                  </Form.Group>
                  <Form.Group
                    className="mt-6"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Medicine Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      rows={6}
                      onChange={handleChange}
                      value={addData.description}
                      placeholder="Provide Description Of Medicine"
                    />
                  </Form.Group>
                </div>
              </div>
            )}
            {modalState == 2 && (
              <div className="form-group row">
                <div className="col-lg-12">
                  <div className="fs-7">Add Product Main Image</div>
                  <label
                    htmlFor="oneFile"
                    className=" h-150px w-100 d-flex justify-content-center align-items-center  border-dashed border-light "
                    role="button"
                  >
                    <div id="mainimage" className="fs-10">
                      {isPrev ? (
                        mainImg ? (
                          <img src={mainImg} width={160} height={140} />
                        ) : (
                          "Click To Add Image"
                        )
                      ) : (
                        " Click To Add Image"
                      )}
                    </div>
                  </label>
                </div>
              

                <input
                  type="file"
                  name="mainImage"
                  id="oneFile"
                  hidden
                  accept="image/*"
                  onChange={imageMainhandle}
                />
                <input
                  type="file"
                  name="images"
                  id="multyFile"
                  hidden
                  multiple="multiple"
                  accept="image/*"
                  onChange={imageGallaryhandle}
                />
              </div>
            )}
            {modalState == 3 && (
              <div className="form-group row">
                <div class="container">
                  <div class="row justify-content-between">
                    <div class="col-6" style={{ position: "relative" }}>
                      <Form.Group>
                        <Form.Label>Manufacturer Name</Form.Label>
                        <Form.Control
                          type="text"
                          id="name"
                          // className={errors["name"] && "chipInputRed"}
                          label="Manufacturer Name"
                          required
                          name="manufacturerName"
                          onChange={handleChange}
                          value={addData.manufacturerName}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "68px",
                            background: "lightGray",
                            width: "352px",
                            zIndex: "10",
                            borderRadius: "3px",
                          }}
                        >
                          {mnameSuggestion.map((item) => {
                            return (
                              <>
                                <div
                                  style={{
                                    padding: "10px",
                                    borderBottom: "1px solid gray",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    onMnameSuggestionClick(item);
                                  }}
                                >
                                  {item}
                                </div>
                              </>
                            );
                          })}
                        </div>

                        <span className="errorInput">
                          {/* {data.name?.length > 0 ? "" : errors["name"]} */}
                        </span>
                      </Form.Group>
                    </div>
                    <div class="col-3">
                      <Form.Group>
                        <Form.Label>Pack</Form.Label>
                        <Form.Control
                          type="text"
                          id="packID"
                          // className={errors["name"] && "chipInputRed"}
                          label="pack"
                          required
                          name="pack"
                          onChange={handleChange}
                          value={addData.pack}
                        />

                        <span className="errorInput">
                          {/* {data.name?.length > 0 ? "" : errors["name"]} */}
                        </span>
                      </Form.Group>
                    </div>
                    <div class="col-3">
                      <Form.Group>
                        <Form.Label>PTR</Form.Label>
                        <Form.Control
                          type="text"
                          id="ptrID"
                          // className={errors["name"] && "chipInputRed"}
                          label="ptr"
                          required
                          name="ptr"
                          onChange={handleChange}
                          value={addData.ptr}
                        />

                        <span className="errorInput">
                          {/* {data.name?.length > 0 ? "" : errors["name"]} */}
                        </span>
                      </Form.Group>
                    </div>
                  </div>
                  <div class="row justify-content-between">
                    <div class="col-3">
                      <Form.Group>
                        <Form.Label>Stocks</Form.Label>
                        <Form.Control
                          type="text"
                          id="stocksID"
                          // className={errors["name"] && "chipInputRed"}
                          label="stocks"
                          required
                          name="stocks"
                          onChange={handleChange}
                          value={addData.stocks}
                        />

                        <span className="errorInput">
                          {/* {data.name?.length > 0 ? "" : errors["name"]} */}
                        </span>
                      </Form.Group>
                    </div>
                    <div class="col-3">
                      <Form.Group>
                        <Form.Label>MRP</Form.Label>
                        <div className="d-flex">
                          <div
                            className="d-flex justify-content-center align-items-center position-relative  "
                            style={{
                              background: "#f3f6f9",
                              width: "40px",
                              zIndex: "2",
                              left: "4px",
                            }}
                          >
                            <div>$</div>
                          </div>
                          <Form.Control
                            type="text"
                            id="mrpID"
                            // className={errors["name"] && "chipInputRed"}
                            label="mrp"
                            required
                            name="mrp"
                            onChange={handleChange}
                            value={addData.mrp}
                            className="position-relative"
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div class="col-3">
                      <Form.Group>
                        <Form.Label>Other Discount</Form.Label>
                        <div className="d-flex">
                          <div
                            className="d-flex justify-content-center align-items-center position-relative  "
                            style={{
                              background: "#f3f6f9",
                              width: "40px",
                              zIndex: "2",
                              left: "4px",
                            }}
                          >
                            <div>%</div>
                          </div>
                          <Form.Control
                            type="text"
                            id="discountID"
                            // className={errors["name"] && "chipInputRed"}
                            label="discount"
                            required
                            name="marginalDiscount"
                            onChange={handleChange}
                            value={addData.marginalDiscount}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div class="col-3">
                      <Form.Group>
                        <Form.Label>Scheme</Form.Label>
                        <Form.Control
                          type="text"
                          id="scemeID"
                          // className={errors["name"] && "chipInputRed"}
                          label="scheme"
                          required
                          name="Scheme"
                          onChange={handleChange}
                          value={addData.Scheme}
                        />

                        <span className="errorInput">
                          {/* {data.name?.length > 0 ? "" : errors["name"]} */}
                        </span>
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {modalState == 4 && (
              <div className="form-group row">
                <div className="container">
                  <div className="row justify-content-between">
                    <div className="col-6">
                      <Form.Group>
                        <Form.Label>Chemical Composition</Form.Label>
                        <Form.Control
                          type="text"
                          id="compositionID"
                          // className={errors["name"] && "chipInputRed"}
                          placeholder="Add chemical composition for product"
                          label="Chemical"
                          required
                          name="chemicalComposition"
                          onChange={handleChange}
                          value={addData.chemicalComposition}
                        />

                        <span className="errorInput">
                          {/* {data.name?.length > 0 ? "" : errors["name"]} */}
                        </span>
                      </Form.Group>
                    </div>
                    <div className="col-6">
                      <Form.Group>
                        <Form.Label>HSN Code</Form.Label>
                        <Form.Control
                          type="text"
                          id="hsnID"
                          // className={errors["name"] && "chipInputRed"}
                          label="hsn"
                          required
                          name="hsnCode"
                          placeholder="Enter HSN Code Of Medicine"
                          onChange={handleChange}
                          value={addData.hsnCode}
                        />

                        <span className="errorInput">
                          {/* {data.name?.length > 0 ? "" : errors["name"]} */}
                        </span>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row justify-content-between">
                    <div className="col-6">
                      <Form.Group>
                        <Form.Label>Product Categories</Form.Label>
                        <Form.Control
                          as="select"
                          placeholder="select category"
                          onChange={handleCatchange}
                        >
                          <option>Select Category</option>
                          {category.map((data) => (
                            <option data-id={data._id}>{data.name}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </div>
                    <div className="col-6">
                      <Form.Group>
                        <Form.Label>&nbsp;</Form.Label>
                        <Form.Control
                          as="text"
                          id="category_show"
                          readOnly
                        ></Form.Control>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row justify-content-between">
                    <div className="col-6">
                      <Form.Group>
                        <Form.Label>Product tags</Form.Label>
                        <Form.Control
                          as="text"
                          id="tagsID"
                          // className={errors["name"] && "chipInputRed"}
                          label="tags"
                          required
                          name="tags"
                          placeholder="Select Product Tag"
                          onChange={handleChange}
                          value={addData.tags}
                          onKeyDown={handleTagShow}
                        />

                        <span className="errorInput">
                          {/* {data.name?.length > 0 ? "" : errors["name"]} */}
                        </span>
                      </Form.Group>
                    </div>
                    <div className="col-6">
                      <Form.Group>
                        <Form.Label>&nbsp;</Form.Label>
                        <Form.Control
                          as="text"
                          id="tags_show"
                          readOnly
                        ></Form.Control>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row justify-content-start mt-6">
                    <div className="col-8">
                      <Form.Group>
                        <Form.Label>Product Short Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={6}
                          value={addData.ShortDesc}
                          name="ShortDesc"
                          onChange={handleChange}
                          placeholder="Add short description for product"
                        />

                        <span className="errorInput">
                          {/* {data.name?.length > 0 ? "" : errors["name"]} */}
                        </span>
                      </Form.Group>
                    </div>
                    <div className="col-4">
                      <Form.Group md="6">
                        <Form.Label>Gst</Form.Label>
                        <Form.Control
                          type="text"
                          id="gst"
                          // className={errors["name"] && "chipInputRed"}
                          label="tags"
                          required
                          name="gst"
                          placeholder="Gst Detail"
                          onChange={handleChange}
                          value={addData.gst}
                        />
                      </Form.Group>
                      {/* </div>
                  <div className="col-4"> */}
                      <Form.Group md="6">
                        <Form.Label>Publish</Form.Label>
                        <Form.Control
                          as="select"
                          placeholder="select category"
                          onChange={handleChange}
                          name="status"
                        >
                          <option>Select Status</option>
                          <option value="true">Public</option>
                          <option value="false">Draft</option>
                        </Form.Control>
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex justify-content-between w-100 ">
              <button
                type="submit"
                onClick={() => {
                  setModalState(modalState - 1);
                  setIsPrev(true);
                }}
                // disabled={button}
                className={`btn btn-primary btn-elevate ${
                  modalState == 1 ? "invisible" : "visible"
                }`}
              >
                PREV
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => setModal(!modal)}
                  className="btn btn-light btn-elevate mr-2"
                >
                  CANCEL
                </button>

                {modalState != 4 ? (
                  <button
                    type="submit"
                    onClick={() => {
                      setModalState(modalState + 1);
                      setIsPrev(false);
                    }}
                    className="btn btn-primary btn-elevate"
                  >
                    NEXT
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={handleAddMedicineSubmit}
                    // disabled={button}
                    className="btn btn-primary btn-elevate"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
      <Modal
        centered
        show={delet}
        onHide={() => {
          setDelet(!delet);
          setDeletId("");
        }}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Delete Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>
            Are you sure you want to delete this Category permanently?
          </span>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => {
                setDelet(!delet);
                setDeletId("");
              }}
              className="btn btn-light btn-elevate"
            >
              Cancel
            </button>
            <> </>
            <button
              type="button"
              onClick={() => deletMedicine()}
              className="btn btn-primary btn-elevate"
            >
              Delete
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      {editModal && (
        <MedicineEdit
          hide={hide}
          data={editData}
          state={editModal}
          category={category}
          fetchData={fetchData}
          currentpage={currentpage}
          pagesize={pagesize}
          searching={searching}
        ></MedicineEdit>
      )}
    </>
  );
}
