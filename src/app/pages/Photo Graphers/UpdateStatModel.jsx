import React, { useState } from "react";
import { Form } from "react-bootstrap";

function UpdateStatModel({
  handleupdateStatus,
  handleChangeStatus,
  data,
  setUpdateMenu,
  updateMenu,
}) {
  const [status, setStatus] = useState([
    "Placed",
    "Processing",
    "Rejected",
    "Shipping",
    "Delivered",
    "Return In Progress",
    "Return",
  ]);
  return (
    <>
      <div className="d-flex w-100 justify-content-between align-items-center mt-2 border-top-light border-1">
        <div className="text-center w-80">
          <Form.Group>
            <Form.Label>From</Form.Label>
            <Form.Control
              type="text"
              id="packID"
              readOnly
              label="pack"
              required
              name="pack"
              placeholder={status[data?.orderStatus]}
            />
          </Form.Group>
        </div>
        <div className="w-50 text-center">
          <div>
            <Form.Group>
              <Form.Label>To</Form.Label>
              <Form.Control
                as="select"
                placeholder="Change Status"
                onChange={handleChangeStatus}
              >
                <option>Select Status</option>
                {/* {status?.map((data, idx) => (
                                <option data-id={idx}>{data}</option>
                              ))} */}
                <option data-id={0}>Placed</option>
                <option data-id={1}>Processing</option>
                <option data-id={3}>Shipping</option>
                <option data-id={4}>Delivered</option>
                <option data-id={5}>Return In Progress</option>
                <option data-id={6}>Return</option>
              </Form.Control>
            </Form.Group>
          </div>
        </div>
        <div className="d-flex " style={{ zIndex: "12" }}>
          <div
            className="p-2 btn-success text-gray-100 "
            onClick={() => handleupdateStatus()}
          >
            Change
          </div>
          <div
            className="p-2 btn-danger text-red-500 "
            onClick={() => setUpdateMenu(!updateMenu)}
          >
            Cancle
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateStatModel;
