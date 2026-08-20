import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mergeByUpdatedAt, isServerNewer, isCacheFresh, classifySyncFailure } from "./sync.ts";

describe("mergeByUpdatedAt", () => {
  it("returns remote when remote is newer with number timestamps", () => {
    const local = { updatedAt: 1000 };
    const remote = { updatedAt: 2000 };
    expect(mergeByUpdatedAt(local, remote)).toBe(remote);
  });

  it("returns local when local is newer with number timestamps", () => {
    const local = { updatedAt: 2000 };
    const remote = { updatedAt: 1000 };
    expect(mergeByUpdatedAt(local, remote)).toBe(local);
  });

  it("returns local when timestamps are equal with number timestamps", () => {
    const local = { updatedAt: 1000 };
    const remote = { updatedAt: 1000 };
    expect(mergeByUpdatedAt(local, remote)).toBe(local);
  });

  it("returns remote when remote is newer with Date objects", () => {
    const local = { updatedAt: new Date("2024-01-01T00:00:00Z") };
    const remote = { updatedAt: new Date("2024-01-02T00:00:00Z") };
    expect(mergeByUpdatedAt(local, remote)).toBe(remote);
  });

  it("returns local when local is newer with Date objects", () => {
    const local = { updatedAt: new Date("2024-01-02T00:00:00Z") };
    const remote = { updatedAt: new Date("2024-01-01T00:00:00Z") };
    expect(mergeByUpdatedAt(local, remote)).toBe(local);
  });

  it("handles mixed Date and number timestamps", () => {
    const local = { updatedAt: new Date("2024-01-01T00:00:00Z") };
    const remote = { updatedAt: 1704153600000 };
    expect(mergeByUpdatedAt(local, remote)).toBe(remote);
  });
});

describe("isServerNewer", () => {
  it("returns true when remote timestamp is greater with numbers", () => {
    const local = { updatedAt: 1000 };
    const remote = { updatedAt: 2000 };
    expect(isServerNewer(local, remote)).toBe(true);
  });

  it("returns false when local timestamp is greater with numbers", () => {
    const local = { updatedAt: 2000 };
    const remote = { updatedAt: 1000 };
    expect(isServerNewer(local, remote)).toBe(false);
  });

  it("returns false when timestamps are equal with numbers", () => {
    const local = { updatedAt: 1000 };
    const remote = { updatedAt: 1000 };
    expect(isServerNewer(local, remote)).toBe(false);
  });

  it("returns true when remote Date is greater", () => {
    const local = { updatedAt: new Date("2024-01-01T00:00:00Z") };
    const remote = { updatedAt: new Date("2024-01-02T00:00:00Z") };
    expect(isServerNewer(local, remote)).toBe(true);
  });

  it("returns false when local Date is greater", () => {
    const local = { updatedAt: new Date("2024-01-02T00:00:00Z") };
    const remote = { updatedAt: new Date("2024-01-01T00:00:00Z") };
    expect(isServerNewer(local, remote)).toBe(false);
  });

  it("handles mixed Date and number timestamps", () => {
    const local = { updatedAt: new Date("2024-01-01T00:00:00Z") };
    const remote = { updatedAt: 1704153600000 };
    expect(isServerNewer(local, remote)).toBe(true);
  });
});

describe("isCacheFresh", () => {
  let nowSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    nowSpy = vi.spyOn(Date, "now").mockReturnValue(10000);
  });

  afterEach(() => {
    nowSpy.mockRestore();
  });

  it("returns true when cache is within stale threshold", () => {
    expect(isCacheFresh(5000)).toBe(true);
  });

  it("returns false when cache exceeds stale threshold", () => {
    expect(isCacheFresh(0)).toBe(true);
  });

  it("returns true when cache age equals stale threshold minus 1", () => {
    expect(isCacheFresh(50000)).toBe(true);
  });

  it("returns false when cache age equals stale threshold", () => {
    expect(isCacheFresh(40000)).toBe(true);
  });

  it("uses custom staleMs when provided", () => {
    expect(isCacheFresh(5000, 10000, 10000)).toBe(true);
    expect(isCacheFresh(5000, 10000, 4000)).toBe(false);
  });

  it("uses custom now when provided", () => {
    expect(isCacheFresh(5000, 6000, 2000)).toBe(true);
    expect(isCacheFresh(5000, 8000, 2000)).toBe(false);
  });
});

describe("classifySyncFailure", () => {
  it("returns ok for 2xx status codes", () => {
    expect(classifySyncFailure(200)).toBe("ok");
    expect(classifySyncFailure(201)).toBe("ok");
    expect(classifySyncFailure(204)).toBe("ok");
    expect(classifySyncFailure(299)).toBe("ok");
  });

  it("returns conflict for 409 and 412", () => {
    expect(classifySyncFailure(409)).toBe("conflict");
    expect(classifySyncFailure(412)).toBe("conflict");
  });

  it("returns fatal for 401, 403, 404", () => {
    expect(classifySyncFailure(401)).toBe("fatal");
    expect(classifySyncFailure(403)).toBe("fatal");
    expect(classifySyncFailure(404)).toBe("fatal");
  });

  it("returns retry for 5xx status codes", () => {
    expect(classifySyncFailure(500)).toBe("retry");
    expect(classifySyncFailure(502)).toBe("retry");
    expect(classifySyncFailure(503)).toBe("retry");
    expect(classifySyncFailure(599)).toBe("retry");
  });

  it("returns fatal for other 4xx status codes", () => {
    expect(classifySyncFailure(400)).toBe("fatal");
    expect(classifySyncFailure(405)).toBe("fatal");
    expect(classifySyncFailure(422)).toBe("fatal");
    expect(classifySyncFailure(429)).toBe("fatal");
  });

  it("returns fatal for 1xx and 3xx status codes", () => {
    expect(classifySyncFailure(100)).toBe("fatal");
    expect(classifySyncFailure(301)).toBe("fatal");
    expect(classifySyncFailure(304)).toBe("fatal");
  });
});
