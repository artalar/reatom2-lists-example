import React from "react";
import { useAction, useAtom } from "@reatom/react";
import { entitiesAtom, link } from "./model";

export function Link() {
  const [{ users, roles }] = useAtom(entitiesAtom);
  const handleLink = useAction(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const userIndex = +e.currentTarget.querySelector<HTMLSelectElement>(
        '[aria-label="users"]'
      ).value;
      const userAtom = users[userIndex].atom;

      const roleIndex = +e.currentTarget.querySelector<HTMLSelectElement>(
        '[aria-label="roles"]'
      ).value;
      const roleAtom = roles[roleIndex].atom;

      return link(userAtom, roleAtom);
    },
    [users, roles]
  );

  return (
    <>
      <h4>Link</h4>
      <form onSubmit={handleLink}>
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
        <button type="submit" disabled={!users.length || !roles.length}>
          Link
        </button>
      </form>
    </>
  );
}
