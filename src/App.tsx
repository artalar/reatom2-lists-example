import React from "react";
import { createStore } from "@reatom/core";
import { storeContext } from "./internal";
import { UserForm, Users } from "./Users";
import { RoleForm, Roles } from "./Roles";
import { Link } from "./Link";
import { Snapshots } from "./Snapshots";

export default function App() {
  return (
    <storeContext.Provider value={createStore()}>
      <UserForm />
      <RoleForm />
      <Users />
      <Roles />
      <Link />
      <Snapshots />
    </storeContext.Provider>
  );
}

// TODO: @reatom/react
