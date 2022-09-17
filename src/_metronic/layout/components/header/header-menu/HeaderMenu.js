/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";

export function HeaderMenu({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url) => {
    return checkIsActive(location, url) ? "menu-item-active" : "";
  };

  return (
    <div
      id="kt_header_menu"
      className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
      {...layoutProps.headerMenuAttributes}
    >
      {/*begin::Header Nav*/}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item menu-item-rel ${getMenuItemActive(
            "/dashboard"
          )}`}
        >
          {/* <NavLink className="menu-link" to="/dashboard">
            <span className="menu-text">Dashboard</span>
            {layoutProps.rootArrowEnabled && <i className="menu-arrow" />}
          </NavLink> */}
        </li>
        {/* <li className={`menu-item menu-item-rel ${getMenuItemActive("/user")}`}>
          <NavLink className="menu-link" to="/user">
            <span className="menu-text">User</span>
            {layoutProps.rootArrowEnabled && <i className="menu-arrow" />}
          </NavLink>
        </li>
        <li
          className={`menu-item menu-item-rel ${getMenuItemActive("/seller")}`}
        >
          <NavLink className="menu-link" to="/seller">
            <span className="menu-text">Seller</span>
            {layoutProps.rootArrowEnabled && <i className="menu-arrow" />}
          </NavLink>
        </li>
        <li
          className={`menu-item menu-item-rel ${getMenuItemActive(
            "/categorys"
          )}`}
        >
          <NavLink className="menu-link" to="/categorys">
            <span className="menu-text">Category</span>
            {layoutProps.rootArrowEnabled && <i className="menu-arrow" />}
          </NavLink>
        </li> */}
        {/*end::1 Level*/}

        {/*Classic submenu*/}
        {/*begin::1 Level*/}

        {/*end::1 Level*/}

        {/*Mega submenu*/}
        {/*begin::1 Level*/}

        {/*Classic submenu*/}
        {/*begin::1 Level*/}

        {/*end::1 Level*/}
      </ul>
      {/*end::Header Nav*/}
    </div>
  );
}
