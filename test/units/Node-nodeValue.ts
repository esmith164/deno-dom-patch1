import { DOMParser } from "../../deno-dom-wasm.ts";
import { assertStrictEquals as assertEquals } from "assert";

// TODO: More comprehensive tests

Deno.test("Setting Node.nodeValue is ignored", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div></div>
    `,
    "text/html",
  );

  const div = doc.querySelector("div")!;

  div.nodeValue = "";
  doc.nodeValue = "";

  assertEquals(div.nodeValue, null);
  assertEquals(doc.nodeValue, null);
});
