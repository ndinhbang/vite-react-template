import {Fragment} from "react";
import {CBadge, CNavGroup, CNavItem} from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import {cilPuzzle, cilSpeedometer} from "@coreui/icons";

const SidebarNav = () => {
    return (
        <Fragment>
            <CNavItem href="#">
                <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                Nav item
            </CNavItem>
            <CNavItem href="#">
                <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                With badge
                <CBadge color="primary ms-auto">NEW</CBadge>
            </CNavItem>
            <CNavGroup toggler="Nav dropdown">
                <CNavItem href="#">
                    <CIcon customClassName="nav-icon" icon={cilPuzzle} /> Nav dropdown item
                </CNavItem>
                <CNavItem href="#">
                    <CIcon customClassName="nav-icon" icon={cilPuzzle} /> Nav dropdown item
                </CNavItem>
            </CNavGroup>
            <CNavItem href="#">
                <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                Nav item
            </CNavItem>
            <CNavItem href="#">
                <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                With badge
                <CBadge color="primary ms-auto">NEW</CBadge>
            </CNavItem>
            <CNavGroup toggler="Nav dropdown">
                <CNavItem href="#">
                    <CIcon customClassName="nav-icon" icon={cilPuzzle} /> Nav dropdown item
                </CNavItem>
                <CNavItem href="#">
                    <CIcon customClassName="nav-icon" icon={cilPuzzle} /> Nav dropdown item
                </CNavItem>
            </CNavGroup>
        </Fragment>
    )
}

export default SidebarNav