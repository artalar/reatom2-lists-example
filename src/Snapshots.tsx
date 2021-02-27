import React from "react";
import { useAtom } from "./internal";
import { snapshotsAtom } from "./model";

export function Snapshots() {
  const snapshots = useAtom(snapshotsAtom);

  return (
    <>
      <h4>Snaphots</h4>
      <pre>
        {snapshots
          .slice(0)
          .reverse()
          .map((str) => `${"-".repeat(30)}${str}`)}
      </pre>
    </>
  );
}
