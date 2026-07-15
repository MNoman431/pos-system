// src/components/layout/Sidebar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  TruckIcon,
  BanknotesIcon,
  ChartBarIcon,
  UsersIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);

  const isMaster = user?.roleId === "master" || user?.role?.roleMap === "all";
  const roleMap = user?.role?.roleMap || {};
  const can = (perm) => {
    if (isMaster) return true;
    return !!roleMap[perm];
  };

  const sections = useMemo(
    () => [
      { type: "link", label: "Home", to: "/home", icon: HomeIcon, show: true },
      {
        type: "group",
        key: "inventory",
        label: "Inventory",
        icon: CubeIcon,
        show: can("ViewInventory"),
        links: [
          { label: "All Inventory", to: "/inventory/list", show: true },
          { label: "Add Inventory", to: "/inventory/add", show: can("AddInventory") },
        ],
      },
      {
        type: "group",
        key: "purchases",
        label: "Purchases",
        icon: ShoppingCartIcon,
        show: can("ViewPurchaseList"),
        links: [
          { label: "Purchase Invoices", to: "/purchase/list", show: true },
          { label: "New Invoice", to: "/purchase/new", show: can("CreatePurchase") },
        ],
      },
      {
        type: "group",
        key: "vendors",
        label: "Vendors",
        icon: TruckIcon,
        show: can("ViewVendors"),
        links: [
          { label: "All Vendors", to: "/vendors", show: true },
          { label: "Add Vendor", to: "/vendors/add", show: can("AddVendor") },
        ],
      },
      {
        type: "group",
        key: "sales",
        label: "Sales",
        icon: BanknotesIcon,
        show: can("ViewSalesList"),
        links: [
          { label: "All Sales", to: "/sales/list", show: true },
          { label: "Add Sale", to: "/sales/add", show: can("CreateSale") },
        ],
      },
      { type: "link", label: "Dashboard", to: "/dashboard", icon: ChartBarIcon, show: can("ViewDashboard") },
      {
        type: "group",
        key: "roles",
        label: "Roles",
        icon: UsersIcon,
        show: (isMaster || can("ManageRoles")) || (isMaster || can("AssignRole")) || (isMaster || can("RoleList")),
        links: [
          { label: "Add Role", to: "/dashboard/roles/add", show: isMaster || can("ManageRoles") },
          { label: "Assign Role", to: "/dashboard/assign-role", show: isMaster || can("AssignRole") },
          { label: "Role List", to: "/dashboard/role-list", show: isMaster || can("RoleList") },
        ],
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMaster, JSON.stringify(roleMap)],
  );

  const [openGroups, setOpenGroups] = useState(() => new Set());

  // Auto-expand the group matching the current route
  useEffect(() => {
    for (const section of sections) {
      if (section.type !== "group") continue;
      const match = section.links.some((l) => location.pathname.startsWith(l.to));
      if (match) {
        setOpenGroups((prev) => new Set(prev).add(section.key));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleGroup = (key) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const linkBase =
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150";
  const linkInactive = "text-slate-400 hover:bg-slate-800 hover:text-white";
  const linkActive = "bg-indigo-600 text-white shadow-sm";

  const subLinkBase =
    "block rounded-lg py-2 pl-11 pr-3 text-sm transition-colors duration-150";
  const subLinkInactive = "text-slate-400 hover:bg-slate-800 hover:text-white";
  const subLinkActive = "bg-indigo-600/90 text-white";

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-5">
          <span className="text-xl font-extrabold tracking-tight text-white">
            Fancy<span className="text-indigo-400">POS</span>
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {sections.map((section) => {
            if (!section.show) return null;

            if (section.type === "link") {
              const Icon = section.icon;
              return (
                <NavLink
                  key={section.label}
                  to={section.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {section.label}
                </NavLink>
              );
            }

            const Icon = section.icon;
            const isOpen = openGroups.has(section.key);
            const visibleLinks = section.links.filter((l) => l.show);
            if (visibleLinks.length === 0) return null;

            return (
              <div key={section.key}>
                <button
                  type="button"
                  onClick={() => toggleGroup(section.key)}
                  className={`${linkBase} ${linkInactive} w-full justify-between`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0" />
                    {section.label}
                  </span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-1 space-y-1">
                    {visibleLinks.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `${subLinkBase} ${isActive ? subLinkActive : subLinkInactive}`
                        }
                      >
                        {l.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
