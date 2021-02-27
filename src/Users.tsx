import React from "react";
import { Atom } from "@reatom/core";
import { useAction, useAtom } from "./internal";
import { createUser, IUserAtom, usersAtom } from "./model";

export function UserForm() {
  const handleCreate = useAction(createUser);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.querySelector("input");
        handleCreate(input.value);
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
