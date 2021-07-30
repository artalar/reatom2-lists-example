import { createAtom, Atom } from "@reatom/core";
import { atom } from "@reatom/core/experiments";
import { withDebounce } from "./utils";

export type User = {
  name: string;
  roles: Array<Atom<Role>>;
};
export type Role = {
  name: string;
  users: Array<Atom<User>>;
};

export function createUserAtom(name: User["name"], roles: User["roles"] = []) {
  const userAtom = atom(
    { name, roles } as User,
    {
      addRole: ({ name, roles }, roleAtom: Atom<Role>) => ({
        name,
        roles: [...new Set(roles).add(roleAtom)]
      }),
      changeName: ({ roles }, name: string) => ({ name, roles })
    },
    { id: `role ${name}` }
  );
  return userAtom;
}

export function createRoleAtom(name: Role["name"], users: Role["users"] = []) {
  const roleAtom = atom(
    { name, users } as Role,
    {
      addUser: ({ name, users }, userAtom: Atom<User>) => ({
        name,
        users: [...new Set(users).add(userAtom)]
      }),
      changeName: ({ users }, name: string) => ({ name, users })
    },
    { id: `user ${name}` }
  );
  return roleAtom;
}

export type UserAtom = ReturnType<typeof createUserAtom>;
export type RoleAtom = ReturnType<typeof createRoleAtom>;

export const usersAtom = createAtom(
  { create: (name: string) => name },
  ($, state = new Array<UserAtom>()) => {
    $({ create: (name) => (state = [...state, createUserAtom(name)]) });
    return state;
  },
  {
    id: "users"
  }
);

export const rolesAtom = createAtom(
  { create: (name: string) => name },
  ($, state = new Array<RoleAtom>()) => {
    $({ create: (name) => (state = [...state, createRoleAtom(name)]) });
    return state;
  },
  {
    id: "roles"
  }
);

export const entitiesAtom = createAtom({}, ($) => ({
  users: $(usersAtom).map((atom, index) => ({
    atom,
    index,
    name: $(atom).name
  })),
  roles: $(rolesAtom).map((atom, index) => ({
    atom,
    index,
    name: $(atom).name
  }))
}));

export function link(userAtom: UserAtom, roleAtom: RoleAtom) {
  return [userAtom.addRole(roleAtom), roleAtom.addUser(userAtom)];
}

export const snapshotsAtom = withDebounce(
  1000,
  createAtom({}, ($, state = new Array<string>()) => {
    const roles = $(rolesAtom).map((role) => {
      const { name, users } = $(role);
      return {
        name,
        users: users.map((userAtom) => userAtom.id)
      };
    });
    const users = $(usersAtom).map((user) => {
      const { name, roles } = $(user);
      return {
        name,
        roles: roles.map((roleAtom) => roleAtom.id)
      };
    });

    return (state = [...state, JSON.stringify({ roles, users }, null, 2)]);
  })
);
