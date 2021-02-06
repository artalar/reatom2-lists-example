import React from "react";
import ReactDOM from "react-dom";
import { Atom, createStore, IActionCreator, IAtom, IStore } from "@reatom/core";
import { useAction, useAtom } from "./internal";
import { createUser, IUserAtom, usersAtom } from "./model";

export function UserForm() {
  const updateUsers = useAction(usersAtom.update);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.querySelector("input");
        updateUsers((s) => [...s, createUser(input.value)]);
        input.value = "";
      }}
    >
      <label>
        New user name: <input />
      </label>
      <button type="submit">Create</button>
    </form>
  );
}

export function User({ atom }: { atom: IUserAtom }) {
  const { name } = useAtom(() => atom);
  const roles = useAtom(() =>
    Atom(($) =>
      $(atom)
        .roles.map((roleAtom) => $(roleAtom).name)
        .join(", ")
    )
  );
  const update = useAction(atom.update);

  return (
    <li>
      <label>
        User name:{" "}
        <input
          value={name}
          onChange={(e) =>
            update((s) => ({ ...s, name: e.currentTarget.value }))
          }
        />
      </label>
      <br />
      Roles: {roles}
    </li>
  );
}

export function Users() {
  const users = useAtom(() => usersAtom);

  return (
    <ul>
      {users.map((userAtom) => (
        <User atom={userAtom} />
      ))}
    </ul>
  );
}
