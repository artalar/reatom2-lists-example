import React from "react";
import { Atom } from "@reatom/core";
import { useAction, useAtom } from "./internal";
import { createRole, IRoleAtom, rolesAtom } from "./model";

export function RoleForm() {
  const handleCreate = useAction(createRole);

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

export function Role({ atom }: { atom: IRoleAtom }) {
  const { name } = useAtom(() => atom);
  const users = useAtom(() =>
    Atom(($) =>
      $(atom)
        .users.map((userAtom) => $(userAtom).name)
        .join(", ")
    )
  );
  const update = useAction(atom.update);

  return (
    <li>
      <label>
        Role name:{" "}
        <input
          value={name}
          onChange={(e) =>
            update((s) => ({ ...s, name: e.currentTarget.value }))
          }
        />
      </label>
      <br />
      Users: {users}
    </li>
  );
}

export function Roles() {
  const roles = useAtom(() => rolesAtom);

  return (
    <ul>
      {roles.map((roleAtom) => (
        <Role atom={roleAtom} />
      ))}
    </ul>
  );
}
