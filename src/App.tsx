import React from "react";
import { createStore } from "@reatom/core";
import { reatomContext } from "@reatom/react";
import { UserForm, Users } from "./Users";
import { RoleForm, Roles } from "./Roles";
import { Link } from "./Link";
import { Snapshots } from "./Snapshots";

export default function App() {
  return (
    <reatomContext.Provider value={createStore()}>
      <UserForm />
      <RoleForm />
      <Users />
      <Roles />
      <Link />
      <Snapshots />
    </reatomContext.Provider>
  );
}

// TODO: @reatom/react
