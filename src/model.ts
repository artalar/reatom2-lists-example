import React from "react";
import ReactDOM from "react-dom";
import { Atom, createStore, IActionCreator, IAtom, IStore } from "@reatom/core";

export type IUser = {
  name: string;
  roles: Array<IAtom<IRole>>;
};
export type IRole = {
  name: string;
  users: Array<IAtom<IUser>>;
};

export function createUser(name: IUser["name"], roles: IUser["roles"] = []) {
  return Atom.from<IUser>({ name, roles });
}

export function createRole(name: IRole["name"], users: IRole["users"] = []) {
  return Atom.from<IRole>({ name, users });
}

export type IUserAtom = ReturnType<typeof createUser>;
export type IRoleAtom = ReturnType<typeof createRole>;

export const usersAtom = Atom.from(new Array<IUserAtom>());
export const rolesAtom = Atom.from(new Array<IRoleAtom>());
