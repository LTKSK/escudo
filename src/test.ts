import { isUser } from "./user.validators";

test("pass checks", () => {
  expect(isUser({ name: "111", age: 111, isAdmin: true })).toBe(true);
  expect(isUser({ name: 111, age: 111, isAdmin: true })).toBe(false);
  expect(isUser({ name: "111", age: "111", isAdmin: true })).toBe(false);
  expect(isUser({ name: "111", age: 111, isAdmin: "bbb" })).toBe(false);
  expect(isUser(null)).toBe(false);
  expect(isUser(undefined)).toBe(false);
});
