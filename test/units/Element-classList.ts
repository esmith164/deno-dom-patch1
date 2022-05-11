import { DOMParser } from "../../deno-dom-wasm.ts";
import { assert, assertThrows } from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element.classList.value", () => {
  const doc = new DOMParser().parseFromString("<div class='foo bar'></div>", "text/html")!;
  const div = doc.querySelector("div")!;
  assert(div.classList.value === "foo bar");
  assert(div.classList.contains("foo"));
  assert(div.classList.contains("bar"));
  div.classList.value = "fiz  baz fiz";
  assert(div.classList.value === "fiz  baz fiz");
  assert(!div.classList.contains("foo"));
  assert(!div.classList.contains("bar"));
  assert(div.classList.contains("fiz"));
  assert(div.classList.contains("baz"));
  div.classList.add("qux");
  // @ts-ignore
  assert(div.classList.value === "fiz baz qux");
});

Deno.test("Element.classList.length", () => {
  const doc = new DOMParser().parseFromString("<div class='a   b b'></div>", "text/html")!;
  const div = doc.querySelector("div")!;
  assert(div.classList.length === 2);
  div.classList.add("c");
  // @ts-ignore
  assert(div.classList.length === 3);
  div.classList.remove("a", "b");
  assert(div.classList.length === 1);

  try {
    // @ts-ignore
    div.classList.length = 0;
    assert(div.classList.length === 1);
  } catch (e) {
    assert(e instanceof TypeError);
  }
});

Deno.test("Element.classList.add", () => {
  const doc = new DOMParser().parseFromString("<div></div>", "text/html")!;
  const div = doc.querySelector("div")!;
  div.classList.add("a");
  div.classList.add("b", "c");
  assert(div.classList.contains("a"));
  assert(div.classList.contains("b"));
  assert(div.classList.contains("c"));
});

Deno.test("Element.classList.remove", () => {
  const doc = new DOMParser().parseFromString("<div class='a b c'></div>", "text/html")!;
  const div = doc.querySelector("div")!;
  div.classList.remove("a");
  assert(div.classList.value === "b c");
  div.classList.remove("b", "c");
  // @ts-ignore
  assert(div.classList.value === "");
});

Deno.test("Element.classList.item", () => {
  const doc = new DOMParser().parseFromString("<div class='a b c b a'></div>", "text/html")!;
  const div = doc.querySelector("div")!;

  assert(div.classList.item(0) === "a");
  assert(div.classList.item(-0) === "a");
  assert(div.classList.item(0.9) === "a");
  assert(div.classList.item(-0.9) === "a");
  assert(div.classList.item(NaN) === "a");
  assert(div.classList.item(Infinity) === "a");
  assert(div.classList.item(2**32) === "a");
  assert(div.classList.item(2**32*2) === "a");

  assert(div.classList.item(1) === "b");
  assert(div.classList.item(2**32+1) === "b");
  assert(div.classList.item(2**32*2+1) === "b");

  assert(div.classList.item(2) === "c");
  assert(div.classList.item(2**32*2+2) === "c");
  assert(div.classList.item(Math.E) === "c");

  assert(div.classList.item(3) == null);
  assert(div.classList.item(2**16) === null);
  assert(div.classList.item(2**32*2+3) === null);
  assert(div.classList.item(-1) == null);
  assert(div.classList.item(-Infinity) == null);
});

Deno.test("Element.classList.replace", () => {
  const doc = new DOMParser().parseFromString("<div class='a   b b'></div>", "text/html")!;
  const div = doc.querySelector("div")!;

  assert(div.classList.replace("a", "b") === true, "replace('a', 'b') should return true");
  assert(div.classList.value === "b", "replace('a', 'b') on 'a   b b' should set value to 'b'");

  assert(div.classList.replace("b", "c") === true, "replace('b', 'c') should return true");
  // @ts-ignore
  assert(div.classList.value === "c", "replace('b', 'c') on 'b' should set value to 'c'");

  assert(div.classList.replace("a", "b") === false, "replace('a', 'b') on 'c' should return false");
  assert(div.classList.value === "c", "replace('a', 'b') on 'c' should not change value");

  assertThrows(
    () => div.classList.replace("", "b"),
    DOMException,
    "The token provided must not be empty",
    "replace('', 'b') should throw DOMException",
  );

  assertThrows(
    () => div.classList.replace("a", ""),
    DOMException,
    "The token provided must not be empty",
    "replace('a', '') should throw DOMException",
  );
});
