import { describe, expect, it } from "vitest";
import { decodeGoogleCredentialPayload } from "./googleAuth";

function b64urlEncode(obj: object): string {
  const json = JSON.stringify(obj);
  const b64 = btoa(json);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

describe("decodeGoogleCredentialPayload", () => {
  it("returns name and normalized email from a JWT-shaped credential", () => {
    const header = b64urlEncode({ alg: "RS256", typ: "JWT" });
    const payload = b64urlEncode({
      email: "User@Example.com",
      name: "Ada Lovelace",
    });
    const credential = `${header}.${payload}.sig`;

    expect(decodeGoogleCredentialPayload(credential)).toEqual({
      name: "Ada Lovelace",
      email: "user@example.com",
    });
  });

  it("builds name from given and family name when name is absent", () => {
    const header = b64urlEncode({ alg: "RS256", typ: "JWT" });
    const payload = b64urlEncode({
      email: "x@y.com",
      given_name: "Ada",
      family_name: "Lovelace",
    });
    const credential = `${header}.${payload}.sig`;

    expect(decodeGoogleCredentialPayload(credential)).toEqual({
      name: "Ada Lovelace",
      email: "x@y.com",
    });
  });

  it("returns null when email is missing", () => {
    const header = b64urlEncode({ alg: "RS256", typ: "JWT" });
    const payload = b64urlEncode({ name: "Only Name" });
    const credential = `${header}.${payload}.sig`;

    expect(decodeGoogleCredentialPayload(credential)).toBeNull();
  });

  it("returns null for malformed input", () => {
    expect(decodeGoogleCredentialPayload("not-a-jwt")).toBeNull();
  });
});
