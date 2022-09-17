/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import Button from "reactstrap/es/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { ApiPostInce } from "../../../../../helpers/API/ApiData";
import { Col, FormGroup, Label, Input, Row } from "reactstrap";
import { menu } from "./Menu";
export function AsideMenuList({ layoutProps }) {
  const [type, setType] = useState();
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  const signout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const Id = JSON.parse(localStorage.getItem("userinfo"));
    console.log(menu);
    setType(Id?.role);
  }, []);
  return (
    <>
      {/* begin::Menu Nav */}
      {type === "Admin" ? (
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
          {/*begin::1 Level*/}
          {menu.map((nav) => (
            <li
              className={`menu-item ${
                nav.das
                  ? "menu-item-submenu"
                  : getMenuItemActive(`/${nav.pathname}`, false)
              } `}
              aria-haspopup="true"
              data-menu-toggle={nav.subMenu && "hover"}
            >
              <NavLink className="menu-link menu-toggle" to={nav.pathname}>
                <span className="svg-icon menu-icon">
                  <SVG src={toAbsoluteUrl(nav.img)} />
                </span>
                <span className="menu-text text-capitalize">{nav.title}</span>
                {nav.subMenu && <i className="menu-arrow" />}
              </NavLink>
              {nav.subMenu && (
                <div className="menu-submenu ">
                  <i className="menu-arrow" />
                  <ul className="menu-subnav">
                    {nav.subMenu.map((subNav) => (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          `/${subNav.pathname}`
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to={subNav.pathname}>
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text text-capitalize">
                            {subNav.title}
                          </span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
         
          <li
            className={`menu-item ${getMenuItemActive("", false)}`}
            aria-haspopup="true"
          >
            <div className="menu-link">
            <NavLink className="menu-link" to={'/support'} >

              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Navigation/Sign-out.svg"
                  )}
                />
              </span>
              <span className="menu-text">Support</span>
            </NavLink>
            </div>
          </li>
          
          <li
            className={`menu-item ${getMenuItemActive("", false)}`}
            aria-haspopup="true"
          >
            <div className="menu-link" onClick={() => signout()}>
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Navigation/Sign-out.svg"
                  )}
                />
              </span>
              <span className="menu-text">Sign Out</span>
            </div>
          </li>
        </ul>
      ) : (
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
          {menu
            .filter((val) => val.flag === true)
            .map((nav) => (
              <li
                className={`menu-item ${getMenuItemActive(
                  `/${nav.pathname}`,
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to={nav.pathname}>
                  <span className="svg-icon menu-icon">
                    <SVG src={toAbsoluteUrl(nav.img)} />
                  </span>
                  <span className="menu-text">{nav.title}</span>
                </NavLink>
              </li>
            ))}
            
                           
              {/* <li
               className="menu-item"
               
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to='/reports'>
                  <span className="svg-icon menu-icon">
                    <SVG src="/media/svg/icons/General/Bookmark.svg" />
                  </span>
                  <span className="menu-text">Reports</span>
                </NavLink>
              </li>  
              <li
               className="menu-item"
               
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to='/events'>
                  <span className="svg-icon menu-icon">
                    <SVG src="/media/svg/icons/General/Star.svg" />
                  </span>
                  <span className="menu-text">Events</span>
                </NavLink>
              </li>             
            <li
               className="menu-item"
               
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to='/support'>
                  <span className="svg-icon menu-icon">
                    <SVG src="/media/svg/icons/General/User.svg" />
                  </span>
                  <span className="menu-text">Support</span>
                </NavLink>
              </li>
              <li
               className="menu-item"
               
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to='/q&a'>
                  <span className="svg-icon menu-icon">
                    <SVG src="/media/svg/icons/General/Bookmark.svg" />
                  </span>
                  <span className="menu-text">Q & A</span>
                </NavLink>
              </li>              
              <li
               className="menu-item"
               
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to='/withdrawal'>
                  <span className="svg-icon menu-icon">
                    <SVG src="/media/svg/icons/General/Bookmark.svg" />
                  </span>
                  <span className="menu-text">All Withdrawal</span>
                </NavLink>
              </li>              
          <li
            className={`menu-item ${getMenuItemActive("", false)}`}
            aria-haspopup="true"
          >
            <div className="menu-link" onClick={() => signout()}>
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Navigation/Sign-out.svg"
                  )}
                />
              </span>
              <span className="menu-text">Sign Out</span>
            </div>
          </li> */}
            <li
            className={`menu-item ${getMenuItemActive("", false)}`}
            aria-haspopup="true"
          >
            <div className="menu-link" onClick={() => signout()}>
              <span className="svg-icon menu-icon ">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/HealthSarvAside/signout.svg"
                  )}
                />
              </span>
              <span className="menu-text">Sign Out</span>
            </div>
          </li>
        </ul>
      )}
    </>
  );
}
