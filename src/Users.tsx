import React, { useMemo } from "react";
import { useAction, useAtom } from "@reatom/react";
import { UserAtom, usersAtom } from "./model";
import { createAtom } from "@reatom/core";

export function UserForm() {
  const handleCreate = useAction(usersAtom.create);

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

export function User({ atom }: { atom: UserAtom }) {
  const [{ name }, { changeName }] = useAtom(atom);
  const [roles] = useAtom(
    useMemo(
      () =>
        createAtom(
          {},
          ($) =>
            $(atom)
              .roles.map((roleAtom) => $(roleAtom).name)
              .join(", "),
          { id: `${name} roles` }
        ),
      [atom, name]
    )
  );

  return (
    <li>
      <label>
        User name:{" "}
        <input
          value={name}
          onChange={(e) => changeName(e.currentTarget.value)}
        />
      </label>
      <br />
      Roles: {roles}
    </li>
  );
}

export function Users() {
  const [users] = useAtom(usersAtom);

  return (
    <ul>
      {users.map((userAtom) => (
        <User atom={userAtom} />
      ))}
    </ul>
  );
}
