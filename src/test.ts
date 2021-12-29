import { isUser } from "./user.validators";
import { isGroup } from "./group.validators";

test("pass checks isUser", () => {
  expect(isUser({ name: "111", age: 111, isAdmin: true })).toBe(true);
  expect(isUser({ name: 111, age: 111, isAdmin: true })).toBe(false);
  expect(isUser({ name: "111", age: "111", isAdmin: true })).toBe(false);
  expect(isUser({ name: "111", age: 111, isAdmin: "bbb" })).toBe(false);
  expect(isUser(null)).toBe(false);
  expect(isUser(undefined)).toBe(false);
  expect(isUser({})).toBe(false);
});

test("pass checks isGroup", () => {
  expect(isGroup({ ids: [12, 3, 5], names: ["111", "aaa"] })).toBe(true);
  expect(isGroup({ ids: ["11", 123], names: ["111", "aaa"] })).toBe(false);
  expect(isGroup({ ids: [11, 123], names: [111, "aaa"] })).toBe(false);
  expect(isGroup(null)).toBe(false);
  expect(isGroup(undefined)).toBe(false);
  expect(isGroup({})).toBe(false);
});
