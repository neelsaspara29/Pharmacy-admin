import React, { useState, useEffect } from "react";
// import { Form } from "react-formio";
import { useHistory, Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { ApiPost, ApiGet, ApiPut } from "../../../../helpers/API/ApiData";
import queryString from "query-string";
import BreadcrumbItem from "reactstrap/es/BreadcrumbItem";
import Breadcrumb from "reactstrap/es/Breadcrumb";
import DropzoneComponent from "react-dropzone-component";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Autocomplete from "react-google-autocomplete";
import * as userUtil from "../../../../utils/user.util";

import ReactDOM from "react-dom";
import {
  Col,
  Container,
  CardBody,
  Card,
  Row,
  FormText,
  Form,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { ErrorToast, SuccessToast } from "../../../../helpers/Toast";
const position = {
  maxWidth: "1322px",
  marginTop: "0px",
  marginBottom: "2%",
};
export default function CreateStore() {
  const history = useHistory();
  const [accountData, setaccountData] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [category, setCategory] = useState([]);
  const [storeType, setStoreType] = useState([]);
  const [update, getUpdate] = useState(true);
  const [errors, setError] = useState({});
  const [storeImgUrl, setStoreImgUrl] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgCategoryUrl, setImgCategoryUrl] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [mobilityData, setmobilityData] = useState([]);
  const handleAddadditionalmobility = async (e) => {
    accountData.mobility.push({ name: "", value: 0 });
    setaccountData({ ...accountData });
  };
  const handleRemoveadditionalmobility = async (idx) => {
    accountData.mobility.splice(idx, 1);
    setaccountData({ ...accountData });
  };

  const handleonChange = (e) => {
    let { name, value } = e.target;
    if (name === "canShareWithDifferent") {
      accountData[name] = e.target.checked;
      setaccountData({ ...accountData });
    } else if (name === "canShareWithSame") {
      accountData[name] = e.target.checked;
      setaccountData({ ...accountData });
    } else if (name === "requestSignature") {
      accountData[name] = e.target.checked;
      setaccountData({ ...accountData });
    } else {
      setaccountData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  console.log("accountData", accountData);
  const componentConfig = {
    iconFiletypes: [".jpg", ".png"],
    showFiletypeIcon: true,
    postUrl: { postUrl: "no-url" },
  };
  const djsConfig = {
    addRemoveLinks: true,
    params: {
      myParameter: "I'm a parameter!",
    },
    acceptedFiles: "image/*",
    autoProcessQueue: false,
  };
  const eventHandlers = {
    addedfile: (file) => {
      file.previewElement.querySelector(".dz-progress").style.display = "none";
      file.previewElement.querySelector(".dz-success-mark").style.opacity = 1;

      const formData = new FormData();

      formData.append("image", file);

      ApiPost("image", formData)
        .then((res) => {
          console.log("resImages", res);
          setImgUrl(res.data.data.imageUrl);
        })
        .catch((err) => {
          console.log("Error");
        });
    },
    removedfile: () => {
      //   var stateCopy = Object.assign({}, this.state);
      //   stateCopy.media = {};
      //   console.log("statcopy", stateCopy.media);
      //   this.setState(stateCopy);
    },
    drop: (file) => {
      console.log("jdhjhgdfh", file);
    },
    init: (dropZoneObj) => {
      //   this.setState({ dropZoneObj });
    },
  };

  const componentConfigss = {
    iconFiletypes: [".jpg", ".png"],
    showFiletypeIcon: true,
    postUrl: { postUrl: "no-url" },
  };
  const djsConfigss = {
    addRemoveLinks: true,
    params: {
      myParameter: "I'm a parameter!",
    },
    acceptedFiles: "image/*",
    autoProcessQueue: false,
  };
  const eventHandlersss = {
    addedfile: (file) => {
      file.previewElement.querySelector(".dz-progress").style.display = "none";
      file.previewElement.querySelector(".dz-success-mark").style.opacity = 1;

      const formData = new FormData();

      formData.append("image", file);

      ApiPost("image", formData)
        .then((res) => {
          console.log("resImages", res);
          setStoreImgUrl(res.data.data.imageUrl);
        })
        .catch((err) => {
          console.log("Error");
        });
    },
    removedfile: () => {
      //   var stateCopy = Object.assign({}, this.state);
      //   stateCopy.media = {};
      //   console.log("statcopy", stateCopy.media);
      //   this.setState(stateCopy);
    },
    drop: (file) => {
      console.log("jdhjhgdfh", file);
    },
    init: (dropZoneObj) => {
      //   this.setState({ dropZoneObj });
    },
  };

  const componentConfigs = {
    iconFiletypes: [".jpg", ".png"],
    showFiletypeIcon: true,
    postUrl: { postUrl: "no-url" },
  };
  const djsConfigs = {
    addRemoveLinks: true,
    params: {
      myParameter: "I'm a parameter!",
    },
    acceptedFiles: "image/*",
    autoProcessQueue: false,
  };
  const eventHandlerss = {
    addedfile: (file) => {
      console.log("addedfile", file);

      const formData = new FormData();

      formData.append("image", file);

      ApiPost("image", formData)
        .then((res) => {
          console.log("resImages", res);
          setImgCategoryUrl(res.data.data.imageUrl);
        })
        .catch((err) => {
          console.log("Error");
        });
    },
    removedfile: () => {
      //   var stateCopy = Object.assign({}, this.state);
      //   stateCopy.media = {};
      //   console.log("statcopy", stateCopy.media);
      //   this.setState(stateCopy);
    },
    drop: (file) => {
      console.log("jdhjhgdfh", file);
    },
    init: (dropZoneObj) => {
      //   this.setState({ dropZoneObj });
    },
  };
  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!accountData.storeName) {
      formIsValid = false;
      errors["storeName"] = "*Please Enter storeName";
    }
    if (!accountData.commission) {
      formIsValid = false;
      errors["commission"] = "*Please Enter commission";
    }
    if (!accountData.about) {
      formIsValid = false;
      errors["about"] = "*Please Enter about";
    }
    // if (!accountData.schedulePickupTime) {
    //   formIsValid = false;
    //   errors["schedulePickupTime"] = "*Please Select Start Time";
    // }
    // if (!accountData.scheduleDropTime) {
    //   formIsValid = false;
    //   errors["scheduleDropTime"] = "*Please Select Drop TIme";
    // }
    if (!accountData.storeTypeId) {
      formIsValid = false;
      errors["storeTypeId"] = "*Please select storeTypeId";
    }

    setError(errors);
    return formIsValid;
  };
  const getCity = (addressArray) => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  const getArea = (addressArray) => {
    let area = "";
    let area2 = "";

    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if ("route" === addressArray[i].types[0]) {
          area2 = addressArray[i].long_name;
        }
      }
    }
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name + " " + (area2 ? area2 : "");
            return area;
          }
        }
      }
    }
  };
  /**
   * Get the address and set the address input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  const getState = (addressArray) => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };
  const getCountry = (addressArray) => {
    let country = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0] === "country") {
          country = addressArray[i].long_name;
          return country;
        }
      }
    }
  };
  const getStreetnumber = (addressArray) => {
    let streetNumber = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0] === "street_number") {
          streetNumber = addressArray[i].long_name;
          return streetNumber;
        }
      }
    }
  };

  const getZipCode = (addressArray) => {
    let ZipCode = "";
    for (var i = 0; i < addressArray.length; ++i) {
      if (addressArray[i].types[0] == "postal_code") {
        ZipCode = addressArray[i].long_name;
        return ZipCode;
      }
    }
  };

  const onPlaceSelected = (place) => {
    console.log("place", place);
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = getCity(addressArray),
      area = getArea(addressArray),
      state = getState(addressArray),
      country = getCountry(addressArray),
      ZipCode = getZipCode(addressArray),
      streetNumber = getStreetnumber(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    // Set these values in the state.
    setAddress(address ? address : "");
    setState(state ? state : "");
    setCity(city ? city : "");
    setCountry(country ? country : "");
    setLandmark(area ? area : "");
    setPincode(ZipCode ? ZipCode : "");
    setLongitude(lngValue ? lngValue : "");
    setLatitude(latValue ? latValue : "");
    // this.setState({
    //   address: (address) ? address : '',
    //   streetNumber: (streetNumber) ? streetNumber : '',
    //   area: (area) ? area : '',
    //   city: (city) ? city : '',
    //   state: (state) ? state : '',
    //   ZipCode: (ZipCode) ? ZipCode : '',
    //   markerPosition: {
    //     lat: latValue,
    //     lng: lngValue
    //   },
    //   mapPosition: {
    //     lat: latValue,
    //     lng: lngValue
    //   },
    // })
  };

  const onAutocompleteKeyEvent = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      return false;
    }
  };
  const autoaddress = (res) => {
    console.log("Ress", res);
    const types = JSON.parse(localStorage.getItem("userinfo"));
    const body = {
      userId: types.data._id,
      storeId: res.data.data._id,
      address: address,
      state: state,
      city: city,
      country: country,
      landmark: landmark,
      pincode: pincode,
      addressType: 3,
      latitude: 21.2148083,
      longitude: 72.8887633,
    };
    ApiPost("add-store-address", body)
      .then((res) => {
        if (res.data.status === 200) {
          SuccessToast(res.data.message);
        } else {
          ErrorToast(res.data.message);
        }
      })
      .catch((err) => {
        console.log("Error");
        toastr.error("Error", "Internal Server Error");
      });
  };

  const onSubmit = async (e) => {
    console.log("accountData", accountData);
    if (validateForm()) {
      try {
        const type = JSON.parse(localStorage.getItem("userinfo"));
        const accountData1 = Object.assign(accountData, {
          userId: type.data._id,
          menuImage: [imgUrl],
          // storeImage:[
          //   storeImgUrl
          // ],
          // deliveryTime:`${accountData.schedulePickupTime} to ${accountData.scheduleDropTime}`
        });
        console.log("accountData1", accountData1);
        ApiPost("add-store", accountData1)
          .then((res) => {
            console.log("res", res);
            // userUtil.setStores(res.data);
            localStorage.setItem("myStore", res.data);
            SuccessToast(res.data.message);
            if (res.data.status === 200) {
              autoaddress(res);

              history.push("/auth/login");
            } else {
              ErrorToast(res.data.message);
            }
          })
          .catch((err) => {
            console.log("Error");
            toastr.error("Error", "Internal Server Error");
          });
      } catch (err) {
        console.log("error", err);
      }
    }
  };
  const onUpdate = async (e) => {
    console.log("register", accountData);
    if (validateForm()) {
      const accountData2 = Object.assign(accountData, {
        userId: accountData._id,
        loginType: "custom",
      });
      try {
        ApiPost("update-profile", accountData2)
          .then((res) => {
            console.log("res", res);
            if (res.data.status === 200) {
              SuccessToast(res && res.data && res.data.message);
            } else {
              ErrorToast(res && res.data && res.data.message);
            }
            history.push("/store");
          })
          .catch((err) => {
            console.log("Error");
            toastr.error("Error", "Internal Server Error");
          });
      } catch (err) {
        toastr.error("catgory", "internal server error");
      }
    }
  };
  const fetchData = async (id) => {
    const type = JSON.parse(localStorage.getItem("userinfo"));
    const Ids = {
      userId: type.data[0]._id,
      storeId: id,
    };
    let productValue = await ApiPost("get-store-details-by-id", Ids);
    console.log("productValue", productValue.data.data);
    productValue = productValue.data.data[0];
    console.log(">>>>>>>>>", productValue);
    setaccountData(productValue[0]);

    // getSubmission({ data: productValue[0] });
    getUpdate(false);
  };

  useEffect(() => {
    console.log("Start", window.location.href);
    setUserInfo(JSON.parse(localStorage.getItem("userinfo"))[0]);
    const idValue = queryString.parse(window.location.search);
    console.log("idValue", idValue.id);
    if (
      idValue.id ||
      !idValue.id === undefined ||
      !idValue.id === "undefined"
    ) {
      fetchData(idValue.id);
    }

    ApiPost("get-main-category")
      .then((res) => {
        console.log("res", res);
        setCategory(res.data.data);
      })
      .catch((err) => {
        console.log("Error");
      });

    ApiPost("get-all-store-type")
      .then((res) => {
        console.log("res--->>>>>>", res);
        setStoreType(res.data.data);
      })
      .catch((err) => {
        console.log("Error");
      });
  }, []);

  return (
    <Container style={position}>
      <ToastContainer />
      <Row>
        <Col md={12}>
          <Card>
            <CardBody>
              <Form>
                <h2>
                  <b>Add Your Store</b>
                </h2>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>
                        Store Name<span style={{ color: "red" }}> * </span>
                      </Label>
                      {console.log("accountData.storeName", accountData)}
                      <Input
                        type="text"
                        onChange={(e) => handleonChange(e)}
                        value={accountData.storeName}
                        name="storeName"
                        placeholder="Enter Name"
                      />
                      <span
                        style={{
                          color: "red",

                          top: "5px",
                          fontSize: "10px",
                        }}
                      >
                        {errors["storeName"]}
                      </span>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>
                        Select Store Type
                        <span style={{ color: "red" }}> * </span>
                      </Label>
                      <Input
                        type="select"
                        name="storeTypeId"
                        onChange={(e) => handleonChange(e)}
                        value={accountData.creatorName}
                        onkeyup="filterFunction()"
                        placeholder="select"
                      >
                        <option>Select Store Type</option>
                        {storeType.map((record, i) => {
                          return (
                            <option value={record._id}>
                              {record.storeTypeName}
                            </option>
                          );
                        })}
                      </Input>
                      <span
                        style={{
                          color: "red",

                          top: "5px",
                          fontSize: "10px",
                        }}
                      >
                        {errors["storeTypeId"]}
                      </span>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>
                        About<span style={{ color: "red" }}> * </span>
                      </Label>
                      <Input
                        type="textarea"
                        onChange={(e) => handleonChange(e)}
                        value={accountData.about}
                        name="about"
                        placeholder="Enter about"
                      />
                      <span
                        style={{
                          color: "red",

                          top: "5px",
                          fontSize: "10px",
                        }}
                      >
                        {errors["about"]}
                      </span>
                    </FormGroup>
                  </Col>
                </Row>{" "}
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>
                        Commission<span style={{ color: "red" }}> * </span>
                      </Label>
                      <Input
                        type="number"
                        onChange={(e) => handleonChange(e)}
                        value={accountData.commission}
                        name="commission"
                        placeholder="Enter commission"
                      />
                      <span
                        style={{
                          color: "red",

                          top: "5px",
                          fontSize: "10px",
                        }}
                      >
                        {errors["commission"]}
                      </span>
                    </FormGroup>
                  </Col>
                </Row>{" "}
                {/* <Row>
                  <Col md={3}>
                    <FormGroup>
                      <Label>
                        Start Time<span style={{ color: "red" }}> * </span>
                      </Label>
                      <Input
                        type="time"
                        onChange={(e) => handleonChange(e)}
                        value={accountData.schedulePickupTime}
                        name="schedulePickupTime"
                      />
                      <span
                        style={{
                          color: "red",

                          top: "5px",
                          fontSize: "10px",
                        }}
                      >
                        {errors["schedulePickupTime"]}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label>
                        End Time<span style={{ color: "red" }}> * </span>
                      </Label>
                      <Input
                        type="time"
                        onChange={(e) => handleonChange(e)}
                        value={accountData.scheduleDropTime}
                        name="scheduleDropTime"
                      />
                      <span
                        style={{
                          color: "red",

                          top: "5px",
                          fontSize: "10px",
                        }}
                      >
                        {errors["scheduleDropTime"]}
                      </span>
                    </FormGroup>
                  </Col>
                </Row> */}
                {/* <Row>
                  <Col>
                  <FormGroup>
              <Label>
                <b style={{ color: "#3399ff" }}>
                  Add Store Image <span style={{ color: "red" }}> * </span>
                </b>
            
              </Label>
              <DropzoneComponent
                init={() => {
                  console.log("init called");
                }}
                config={componentConfigss}
                eventHandlers={eventHandlersss}
                djsConfig={djsConfigss}
              />
            </FormGroup>
                  </Col>
              </Row> */}
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>
                        <b style={{ color: "#3399ff" }}>
                          Add Store Image{" "}
                          <span style={{ color: "red" }}> * </span>
                        </b>
                        {/* <span style={{ color: "red" }}> * </span> */}
                      </Label>
                      <DropzoneComponent
                        init={() => {
                          console.log("init called");
                        }}
                        config={componentConfig}
                        eventHandlers={eventHandlers}
                        djsConfig={djsConfig}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <h2>
                  <b>Add Your Store Address</b>
                </h2>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>
                        Address<span style={{ color: "red" }}> * </span>
                      </Label>
                      <Autocomplete
                        className="form-control"
                        name=""
                        onKeyDown={(e) => onAutocompleteKeyEvent(e)}
                        onPlaceSelected={(place) => onPlaceSelected(place)}
                        types={["geocode"]}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Button onClick={(e) => onSubmit(e)}>Add Store</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
