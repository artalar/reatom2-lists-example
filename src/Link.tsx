import React from "react";
import ReactDOM from "react-dom";
import { Atom, createStore, IActionCreator, IAtom, IStore } from "@reatom/core";
import { storeContext, useAtom } from "./internal";
import { rolesAtom, usersAtom } from "./model";

export function Link() {
  const store = React.useContext(storeContext);
  const users = useAtom(() =>
    Atom(($) =>
      $(usersAtom).map((atom, index) => ({
        atom,
        index,
        name: $(atom).name
      }))
    )
  );
  const roles = useAtom(() =>
    Atom(($) =>
      $(rolesAtom).map((atom, index) => ({
        atom,
        index,
        name: $(atom).name
      }))
    )
  );

  return (
    <>
      <h4>Link</h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const userIndex = +e.currentTarget.querySelector<HTMLSelectElement>(
            '[aria-label="users"]'
          ).value;
          const userAtom = users[userIndex].atom;

          const roleIndex = +e.currentTarget.querySelector<HTMLSelectElement>(
            '[aria-label="roles"]'
          ).value;
          const roleAtom = roles[roleIndex].atom;

          store.dispatch([
            userAtom.update((s) => ({
              ...s,
              roles: [...new Set(s.roles).add(roleAtom)]
            })),
            roleAtom.update((s) => ({
              ...s,
              users: [...new Set(s.users).add(userAtom)]
            }))
          ]);
        }}
      >
        Users:{" "}
        <select aria-label="users">
          {users.map(({ name, index }) => (
            <option value={index}>{name}</option>
          ))}
        </select>
        Roles:{" "}
        <select aria-label="roles">
          {roles.map(({ name, index }) => (
            <option value={index}>{name}</option>
          ))}
        </select>
        <button type="submit">Link</button>
      </form>
    </>
  );
}
