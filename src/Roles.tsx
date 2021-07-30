import React, { useMemo } from "react";
import { createAtom } from "@reatom/core";
import { useAction, useAtom } from "@reatom/react";
import { RoleAtom, rolesAtom } from "./model";

export function RoleForm() {
  const handleCreate = useAction(rolesAtom.create);

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
        New role name: <input />
      </label>
      <button type="submit">Create</button>
    </form>
  );
}

export function Role({ atom }: { atom: RoleAtom }) {
  const [{ name }, { changeName }] = useAtom(atom);
  const [users] = useAtom(
    useMemo(
      () =>
        createAtom(
          {},
          ($) =>
            $(atom)
              .users.map((userAtom) => $(userAtom).name)
              .join(", "),
          { id: `${name} users` }
        ),
      []
    )
  );

  return (
    <li>
      <label>
        Role name:{" "}
        <input
          value={name}
          onChange={(e) => changeName(e.currentTarget.value)}
        />
      </label>
      <br />
      Users: {users}
    </li>
  );
}

export function Roles() {
  const [roles] = useAtom(rolesAtom);

  return (
    <ul>
      {roles.map((roleAtom) => (
        <Role atom={roleAtom} />
      ))}
    </ul>
  );
}
