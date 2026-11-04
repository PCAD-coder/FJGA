import assert from "node:assert/strict"
import test from "node:test"
import { getSafeReturnTo, getDashboardForRole } from "../lib/auth/return-to.ts"

test("preserves requested modules, query strings, and fragments", () => {
  for (const path of [
    "/dashboard/products",
    "/my-orders?status=pending",
    "/catalog/item?color=blue#details",
    "/reset-password",
  ]) {
    assert.equal(getSafeReturnTo(path), path)
  }
})

test("rejects external redirects and malformed query parameter types", () => {
  for (const path of [
    undefined,
    null,
    ["/dashboard"],
    "",
    "https://example.com",
    "//example.com",
    "/\\example.com",
    "/dashboard\n",
    "javascript:alert(1)",
  ]) {
    assert.equal(getSafeReturnTo(path), null)
  }
})

test("rejects authentication loops, including normalized dot segments", () => {
  for (const path of [
    "/login",
    "/login/",
    "/login?next=/dashboard",
    "/auth/redirect",
    "/auth/unauthorized",
    "/dashboard/../login",
    "/%2e%2e/auth/redirect",
  ]) {
    assert.equal(getSafeReturnTo(path), null)
  }
})

test("chooses only the dashboard belonging to a recognized role", () => {
  assert.equal(getDashboardForRole("admin"), "/dashboard")
  assert.equal(getDashboardForRole("client"), "/client-dashboard")
  for (const role of [null, undefined, "", "unknown"])
    assert.equal(getDashboardForRole(role), null)
})
