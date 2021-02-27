import { Action, Atom, IAtom } from "@reatom/core";

export type IUser = {
  name: string;
  roles: Array<IAtom<IRole>>;
};
export type IRole = {
  name: string;
  users: Array<IAtom<IUser>>;
};

export function createUserAtom(
  name: IUser["name"],
  roles: IUser["roles"] = []
) {
  const atom = Atom.from<IUser>({ name, roles });
  atom.displayName = name;
  return atom;
}

export function createRoleAtom(
  name: IRole["name"],
  users: IRole["users"] = []
) {
  const atom = Atom.from<IRole>({ name, users });
  atom.displayName = name;
  return atom;
}

export type IUserAtom = ReturnType<typeof createUserAtom>;
export type IRoleAtom = ReturnType<typeof createRoleAtom>;

export const usersAtom = Atom.from(new Array<IUserAtom>());
export const rolesAtom = Atom.from(new Array<IRoleAtom>());

export const createUser = Action((name: string) => ({
  payload: usersAtom.update((s) => [...s, createUserAtom(name)]).payload
}));
createUser.type = usersAtom.update.type;
export const createRole = Action((name: string) => ({
  payload: rolesAtom.update((s) => [...s, createRoleAtom(name)]).payload
}));
createRole.type = rolesAtom.update.type;

export const entitiesAtom = Atom(($) => ({
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

export const snapshotsAtom = Atom(($, state = new Array<string>()) => {
  const roles = $(rolesAtom).map((role) => {
    const { name, users } = $(role);
    return {
      name,
      users: users.map((userAtom) => userAtom.displayName)
    };
  });
  const users = $(usersAtom).map((user) => {
    const { name, roles } = $(user);
    return {
      name,
      roles: roles.map((roleAtom) => roleAtom.displayName)
    };
  });

  return [...state, JSON.stringify({ roles, users }, null, 2)];
});

export function link(userAtom: IUserAtom, roleAtom: IRoleAtom) {
  return [
    userAtom.update((s) => ({
      ...s,
      roles: [...new Set(s.roles).add(roleAtom)]
    })),
    roleAtom.update((s) => ({
      ...s,
      users: [...new Set(s.users).add(userAtom)]
    }))
  ];
}
