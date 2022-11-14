import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { ApiPost, ApiUpload } from "../../../helpers/API/ApiData";
import { SuccessToast } from "../../../helpers/Toast";

const mname = ["Premium Medicare","Pharma Art", "Optimum Healthcare", "Quick Health Remedies", "Diligent Health Solutions", "Noble Pharmaceuticals", "Healthy Life Medicare", "Perfect Pharma Solutions", "Wellness Pharma", "Good Health Pharmaceuticals"]

function MedicineEdit({ data, hide, state, category,fetchData, currentpage, pagesize, searching }) {
  console.log(data, hide, state,category);
  const [editData, setEditData] = useState([]);
  const [modalState, setModalState] = useState(1);
  const [catField, setCatField] = useState("");
  const [mnameSuggestion, setMnameSuggestion] = useState([]);

  const getSuggestion = (v) => {
    if (v) {
      const result = mname.filter((item) => item.toLowerCase().includes(v));
      console.log(result);
      setMnameSuggestion(result);
    } else {
      setMnameSuggestion([]);
    }
  };

  const onMnameSuggestionClick = (v) => {
    setEditData((data) => {
      return { ...data, ["manufacturerName"]: v };
    });
    setMnameSuggestion([]);
  };
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name == "manufacturerName") {
      getSuggestion(value);
    } else {
      setMnameSuggestion([]);
    }
    setEditData((data) => {
      return { ...data, [name]: value };
    });
  };
  const handleCatchange = (e) => {
    let name = e.target.name;
    if (e.target.value != "Select Category") {
      let cat_temp = editData.category;
      cat_temp.push(e.target.options[e.target.selectedIndex].dataset.id);
      console.log(cat_temp);
      setEditData((data) => {
        return { ...data, [name]: cat_temp };
      });
    }
  };
  const handleTagShow = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (e.key == "Enter") {
      let tag_temp = editData.tags;
      tag_temp.push(value);
      setEditData((data) => {
        return {
          ...data,
          [name]: tag_temp,
        };
      });
      setCatField("");
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
        mainimage.innerHTML =
          '<img src="' + this.result + '" width=160px  height=140px />';

        let file = files;
        let fileURL = URL.createObjectURL(file);
        file.fileURL = fileURL;
        let formData = new FormData();
        formData.append("image", file);
        await ApiUpload("upload/profile", formData)
          .then((res) => {
            setEditData({ ...editData, [name]: res?.data?.data?.image });
          })
          .catch((err) => console.log("res_blob", err));
      });
    }
  };
  const imageGallaryhandle = async (e) => {
    let img_array = e.target.files;
    let name = e.target.name;
    const gallaryimage = document.getElementById("gallaryimage");
    gallaryimage.style.display = "block";
    if (gallaryimage.innerHTML == "Click To Add Image")
      gallaryimage.innerHTML = "";
    let temp = [];
    let array = [];
    for (let i = 0; i < img_array.length; i++) {
      if (img_array[i]) {
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

    let temp_1 = [];
    for (let i = 0; i < img_array.length; i++) {
      let file = img_array[i];
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
    temp_1 = editData.images.concat(temp_1);
    setEditData({ ...editData, [name]: temp_1 });
  };
  const handleMedicineUpdate = async () => {
    let body = editData;
    body.medicineId = data._id;
    console.log(body);
    await ApiPost("/medicine/update", body).then((res) => {
      if (res.status == 200) {
        hide();
        SuccessToast("Medicine Updated Successfully");
        fetchData(currentpage, pagesize, searching);
      }
    });
  };
  useEffect(() => {
    setEditData({ ...data });
  }, [data]);
  return (
    <>
      {editData && (
        <Modal
          show={state}
          centered
          size="lg"
          onHide={hide}
          aria-labelledby="example-modal-sizes-title-lg"
          contentClassName="modaldailog"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Medicine Edit
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
                      value={editData.batchNo}
                      placeholder="Batch Number"
                    />

                    <span className="errorInput"></span>
                  </Form.Group>
                  <Form.Group md="6">
                    <Form.Label>Medicine Name</Form.Label>
                    <Form.Control
                      type="text"
                      id="validID"
                      label="Medicinename"
                      required
                      name="name"
                      onChange={handleChange}
                      value={editData.name}
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
                      value={editData.description}
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
                      {editData.mainImage && (
                        <img
                          src={editData.mainImage}
                          width={160}
                          height={140}
                        />
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
              </div>
            )}
            {modalState == 3 && (
              <div className="form-group row">
                <div class="container">
                  <div class="row justify-content-between">
                    <div class="col-6">
                      <Form.Group>
                        <Form.Label>Manufacturer Name</Form.Label>
                        <Form.Control
                          type="text"
                          id="nameID"
                          // className={errors["name"] && "chipInputRed"}
                          label="Manufacturer Name"
                          required
                          name="manufacturerName"
                          onChange={handleChange}
                          value={editData.manufacturerName}
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
                          value={editData.pack}
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
                          value={editData.ptr}
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
                          value={editData.stocks}
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
                            value={editData.mrp}
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
                            value={editData.marginalDiscount}
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
                          value={editData.Scheme}
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
                          value={editData.chemicalComposition}
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
                          value={editData.hsnCode}
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
                          name="category"
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
                          className="overflow-scroll"
                        >
                          {editData.category.map((cat) => (
                            <span className="p-2 bg-light m-2">
                              {
                                category.filter((data) => data._id == cat)[0]
                                  ?.name
                              }
                            </span>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row justify-content-between">
                    <div className="col-6">
                      <Form.Group>
                        <Form.Label>Product tags</Form.Label>
                        <Form.Control
                          type="text"
                          id="tagsID"
                          // className={errors["name"] && "chipInputRed"}
                          label="tags"
                          required
                          name="tags"
                          placeholder="Select Product Tag"
                          onChange={(e) => setCatField(e.target.value)}
                          value={catField}
                          onKeyDown={handleTagShow}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-6">
                      <Form.Group>
                        <Form.Label>&nbsp;</Form.Label>
                        <Form.Control
                          as="text"
                          id="tags_show"
                          readOnly
                          className="overflow-scroll"
                        >
                          {editData.tags.map((tag) => (
                            <span className="p-1 bg-success m-2"># {tag}</span>
                          ))}
                        </Form.Control>
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
                          value={editData.ShortDesc}
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
                          value={editData.gst}
                        />
                      </Form.Group>
                      <Form.Group md="6">
                        <Form.Label>Status</Form.Label>
                        <Form.Group md="6">
                          <Form.Control
                            as="select"
                            placeholder="select category"
                            onChange={handleChange}
                            name="status"
                          >
                            <option>Select Status</option>
                            {editData.status == true ? (
                              <option value="true" selected>
                                Public
                              </option>
                            ) : (
                              <option value="true">Public</option>
                            )}
                            {editData.status == false ? (
                              <option value="false" selected>
                                Draft
                              </option>
                            ) : (
                              <option value="false">Draft</option>
                            )}
                          </Form.Control>
                        </Form.Group>
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
                onClick={() => {
                  setModalState(modalState - 1);
                  // console.log(addData);
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
                  onClick={hide}
                  className="btn btn-light btn-elevate mr-2"
                >
                  Cancel
                </button>

                {modalState != 4 ? (
                  <button
                    type="submit"
                    onClick={() => {
                      setModalState(modalState + 1);
                      // console.log(addData);
                    }}
                    className="btn btn-primary btn-elevate"
                    // disabled={button}
                  >
                    NEXT
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={handleMedicineUpdate}
                    // disabled={button}
                    className="btn btn-primary btn-elevate"
                  >
                    UPDATE
                  </button>
                )}
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default MedicineEdit;
