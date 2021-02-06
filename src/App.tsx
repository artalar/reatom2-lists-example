import React from "react";
import ReactDOM from "react-dom";
import { Atom, createStore, IActionCreator, IAtom, IStore } from "@reatom/core";
import { storeContext } from "./internal";
import { UserForm, Users } from "./Users";
import { RoleForm, Roles } from "./Roles";
import { Link } from "./Link";

export default function App() {
  return (
    <storeContext.Provider value={createStore()}>
      <UserForm />
      <RoleForm />
      <Users />
      <Roles />
      <Link />
    </storeContext.Provider>
  );
}

// TODO: @reatom/react
