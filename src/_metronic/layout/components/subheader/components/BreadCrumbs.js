/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useHistory } from "react-router-dom";

export function BreadCrumbs({ items }) {
  const history = useHistory();
  console.log("items", items);
  if (!items || !items.length) {
    return "";
  }

  return (
    <div class="subheader py-2 py-lg-6  subheader-transparent " id="kt_subheader">
      <div class=" container  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">

        <div class="d-flex align-items-center flex-wrap mr-1">


          <div class="d-flex align-items-baseline flex-wrap mr-5">

            <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
              {items.map((e) => {
                console.log(e)
                return (
                  <>
                    <li class="breadcrumb-item">
                      <a class="text-muted " onClick={() => history.push(`/${e}`)} style={{ "textTransform": "capitalize" }}>
                        {e}
                      </a>
                    </li>
                  </>
                )
              })}
            </ul>
          </div></div></div></div>
  );
}
