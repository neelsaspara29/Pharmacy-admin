import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {
  ApiGet,
  ApiGetNoAuth,
  ApiPost,
  ApiPostNoAuth,
} from "../../../helpers/API/ApiData";
import NoDataTable from "../../../common/noDataTable";
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
const Withdraw = (props) => {
  console.log(props)
  const [data, setData] = useState([]);
  async function getWithdrawHistory() {
    await ApiPost("/get_withdraw_by_photographerId", {
      page: 1,
      limit: 10,
      photographerId: props.data._id,
    })
      .then(({ data }) => {
        console.log(data.data.withdraw_data);
        setData(data.data.withdraw_data);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getWithdrawHistory();
  }, []);
  return (
    
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
 
  );
};

export default Withdraw;
