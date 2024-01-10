import {CSidebar, CSidebarBrand, CSidebarNav} from "@coreui/react-pro";
import {useCallback} from "react";
import SidebarNav from "@/components/app/SidebarNav.jsx";

const Sidebar = () => {
    let sidebarShow = true;
    const onVisibleChange = useCallback((visible) => {
        sidebarShow = true;
    }, [])

    return (
        <CSidebar
            position="fixed"
            unfoldable={true}
            visible={sidebarShow}
            onVisibleChange={onVisibleChange}
        >
            <CSidebarBrand className="d-none d-md-flex" to="/">
                <div className="sidebar-brand-full">App Name</div>
                <div className="sidebar-brand-narrow">App</div>
            </CSidebarBrand>
            <CSidebarNav>
                <SidebarNav/>
            </CSidebarNav>
        </CSidebar>
    );
};

export default Sidebar;
