import React, { useMemo } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { Topbar } from "./Topbar";
import { HeaderMenuWrapper } from "./header-menu/HeaderMenuWrapper";
import { AnimateLoading } from "../../../_partials/controls";


export function Header() {
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      headerClasses: uiService.getClasses("header", true),
      headerAttributes: uiService.getAttributes("header"),
      headerContainerClasses: uiService.getClasses("header_container", true),
      menuHeaderDisplay: objectPath.get(
        uiService.config,
        "header.menu.self.display"
      )
    };
  }, [uiService]);

  return (
    <>
      {/*begin::Header*/}
      <div
        className={`header ${layoutProps.headerClasses}`}
        id="kt_header"
        {...layoutProps.headerAttributes}
      >

        <div className=" container-fluid  d-flex align-items-stretch justify-content-between">
          <div className="" id="">
            <div className="" style={{ color: "#3F4254" }}>

              <div className="border-right-0 d-flex justify-content-start flex-md-row flex-column" triggerSubdivAction='click' o>
                <div className="me-2 bold">
                  Home
                </div>
                <div className="me-2 bold">
                  Pages
                </div>
                <div className="me-2 bold">
                  Plans
                </div>
              </div>
            </div>
          </div>
        </div>


        {/*begin::Container*/}
        <div className={` ${layoutProps.headerContainerClasses} d-flex align-items-stretch justify-content-between`}>
          <AnimateLoading />
          {/*begin::Header Menu Wrapper*/}
          {layoutProps.menuHeaderDisplay && <HeaderMenuWrapper />}
          {!layoutProps.menuHeaderDisplay && <div />}
          {/*end::Header Menu Wrapper*/}

          {/*begin::Topbar*/}
          <Topbar />
          {/*end::Topbar*/}
        </div>
        {/*end::Container*/}
      </div>
      {/*end::Header*/}
    </>
  );
}
