import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  ApiError,
  getMe,
  listNotebooks,
  createNotebook,
  getNotebook,
  updateNotebook,
  deleteNotebook,
  createCell,
  updateCell,
  deleteCell,
  reorderCells,
  listFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  toggleShare,
  getPublicNotebook,
  checkout,
  getSubscriptionStatus,
  cancelSubscription,
} from "./browser.ts";
import { getApiUrl } from "./env.ts";

vi.mock("./env.ts", () => ({
  getApiUrl: vi.fn(),
}));

const mockGetApiUrl = vi.mocked(getApiUrl);

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const BASE_URL = "https://api.example.com";

describe("ApiError", () => {
  it("crea instancia con status y body", () => {
    const error = new ApiError(404, "Not Found");
    expect(error.status).toBe(404);
    expect(error.body).toBe("Not Found");
    expect(error.message).toBe("API error 404: Not Found");
    expect(error.name).toBe("ApiError");
  });
});

describe("getMe", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("obtiene datos del usuario exitosamente", async () => {
    const mockUser = { id: "1", email: "test@example.com", name: "Test User" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockUser,
    });

    const result = await getMe();

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/me`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });
    expect(result).toEqual(mockUser);
  });

  it("maneja error 401", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });

    await expect(getMe()).rejects.toMatchObject({ status: 401 });
  });
});

describe("listNotebooks", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("obtiene lista de notebooks sin cursor", async () => {
    const mockResponse = {
      items: [{ id: "1", title: "Notebook 1" }],
      nextCursor: null,
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await listNotebooks();

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/notebooks`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });
    expect(result).toEqual(mockResponse);
  });

  it("obtiene lista de notebooks con cursor", async () => {
    const mockResponse = {
      items: [{ id: "2", title: "Notebook 2" }],
      nextCursor: "cursor123",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await listNotebooks("cursor123");

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/notebooks?cursor=cursor123`,
      {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "GET",
      },
    );
    expect(result).toEqual(mockResponse);
  });

  it("maneja error 500", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    await expect(listNotebooks()).rejects.toMatchObject({ status: 500 });
  });
});

describe("createNotebook", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("crea notebook exitosamente", async () => {
    const requestData = { title: "New Notebook", accent: "blue" };
    const mockNotebook = {
      id: "1",
      ownerId: "user1",
      title: "New Notebook",
      accent: "blue",
      folderId: null,
      isPublic: false,
      publicSlug: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => mockNotebook,
    });

    const result = await createNotebook(requestData);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/notebooks`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(requestData),
    });
    expect(result).toEqual(mockNotebook);
  });

  it("maneja error 400", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => "Bad Request",
    });

    await expect(createNotebook({ title: "" })).rejects.toMatchObject({
      status: 400,
    });
  });
});

describe("getNotebook", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("obtiene notebook con cells exitosamente", async () => {
    const mockResponse = {
      notebook: { id: "1", title: "Test Notebook", ownerId: "user1", isPublic: false, createdAt: new Date(), updatedAt: new Date() },
      cells: [{ id: "c1", notebookId: "1", orderIdx: 0, kind: "text", input: "Hello", createdAt: new Date(), updatedAt: new Date() }],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await getNotebook("1");

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/notebooks/1`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });
    expect(result).toEqual(mockResponse);
  });

  it("maneja error 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    await expect(getNotebook("nonexistent")).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("updateNotebook", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("actualiza notebook exitosamente", async () => {
    const updateData = { title: "Updated Title" };
    const mockNotebook = {
      id: "1",
      ownerId: "user1",
      title: "Updated Title",
      folderId: null,
      accent: null,
      isPublic: false,
      publicSlug: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockNotebook,
    });

    const result = await updateNotebook("1", updateData);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/notebooks/1`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
    expect(result).toEqual(mockNotebook);
  });

  it("maneja error 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    await expect(updateNotebook("1", { title: "Test" })).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("deleteNotebook", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("elimina notebook exitosamente", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await deleteNotebook("1");

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/notebooks/1`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    });
    expect(result).toBeUndefined();
  });

  it("maneja error 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    await expect(deleteNotebook("nonexistent")).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("createCell", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("crea cell exitosamente", async () => {
    const cellData = { kind: "text" as const, input: "Hello", orderIdx: 0 };
    const mockCell = {
      id: "c1",
      notebookId: "1",
      orderIdx: 0,
      kind: "text",
      input: "Hello",
      output: null,
      references: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => mockCell,
    });

    const result = await createCell("1", cellData);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/notebooks/1/cells`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(cellData),
    });
    expect(result).toEqual(mockCell);
  });

  it("maneja error 400", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => "Bad Request",
    });

    await expect(createCell("1", { kind: "text" })).rejects.toMatchObject({
      status: 400,
    });
  });
});

describe("updateCell", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("actualiza cell exitosamente", async () => {
    const updateData = { input: "Updated input", output: "result" };
    const mockCell = {
      id: "c1",
      notebookId: "1",
      orderIdx: 0,
      kind: "text",
      input: "Updated input",
      output: "result",
      references: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockCell,
    });

    const result = await updateCell("c1", updateData);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/cells/c1`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
    expect(result).toEqual(mockCell);
  });

  it("maneja error 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    await expect(updateCell("c1", { input: "test" })).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("deleteCell", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("elimina cell exitosamente", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await deleteCell("c1");

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/cells/c1`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    });
    expect(result).toBeUndefined();
  });

  it("maneja error 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    await expect(deleteCell("nonexistent")).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("reorderCells", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("reordena cells exitosamente", async () => {
    const reorderData = { order: ["c1", "c2", "c3"] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });

    const result = await reorderCells("1", reorderData);

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/notebooks/1/reorder`,
      {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(reorderData),
      },
    );
    expect(result).toEqual({ ok: true });
  });

  it("maneja error 400", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => "Bad Request",
    });

    await expect(reorderCells("1", { order: [] })).rejects.toMatchObject({
      status: 400,
    });
  });
});

describe("listFolders", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("obtiene lista de folders exitosamente", async () => {
    const mockResponse = {
      items: [
        { id: "f1", ownerId: "user1", name: "Folder 1", parentId: null, createdAt: new Date() },
      ],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await listFolders();

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/folders`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });
    expect(result).toEqual(mockResponse);
  });

  it("maneja error 500", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    await expect(listFolders()).rejects.toMatchObject({ status: 500 });
  });
});

describe("createFolder", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("crea folder exitosamente", async () => {
    const folderData = { name: "New Folder", parentId: null };
    const mockFolder = {
      id: "f1",
      ownerId: "user1",
      name: "New Folder",
      parentId: null,
      createdAt: new Date(),
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => mockFolder,
    });

    const result = await createFolder(folderData);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/folders`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(folderData),
    });
    expect(result).toEqual(mockFolder);
  });

  it("maneja error 400", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => "Bad Request",
    });

    await expect(createFolder({ name: "", parentId: null })).rejects.toMatchObject({
      status: 400,
    });
  });
});

describe("updateFolder", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("actualiza folder exitosamente", async () => {
    const updateData = { name: "Updated Folder" };
    const mockFolder = {
      id: "f1",
      ownerId: "user1",
      name: "Updated Folder",
      parentId: null,
      createdAt: new Date(),
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockFolder,
    });

    const result = await updateFolder("f1", updateData);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/folders/f1`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
    expect(result).toEqual(mockFolder);
  });

  it("maneja error 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    await expect(updateFolder("f1", { name: "Test" })).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("deleteFolder", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("elimina folder exitosamente", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await deleteFolder("f1");

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/folders/f1`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    });
    expect(result).toBeUndefined();
  });

  it("maneja error 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    await expect(deleteFolder("nonexistent")).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("toggleShare", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("habilita share exitosamente", async () => {
    const mockResponse = {
      isPublic: true,
      publicSlug: "abc123",
      publicUrl: "https://example.com/public/abc123",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await toggleShare("1", true);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/notebooks/1/share`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ enabled: true }),
    });
    expect(result).toEqual(mockResponse);
  });

  it("deshabilita share exitosamente", async () => {
    const mockResponse = {
      isPublic: false,
      publicSlug: null,
      publicUrl: null,
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await toggleShare("1", false);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/notebooks/1/share`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ enabled: false }),
    });
    expect(result).toEqual(mockResponse);
  });

  it("maneja error 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    await expect(toggleShare("1", true)).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("getPublicNotebook", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("obtiene notebook publico exitosamente", async () => {
    const mockResponse = {
      notebook: { id: "1", title: "Public Notebook", accent: "blue" },
      cells: [
        { id: "c1", notebookId: "1", orderIdx: 0, kind: "text", input: "Hello", createdAt: new Date(), updatedAt: new Date() },
      ],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await getPublicNotebook("abc123");

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/public/notebooks/abc123`,
      {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "GET",
      },
    );
    expect(result).toEqual(mockResponse);
  });

  it("maneja error 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    await expect(getPublicNotebook("nonexistent")).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("checkout", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("obtiene init_point para plan monthly", async () => {
    const mockResponse = { init_point: "https://mercado-pago.com/checkout/123" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await checkout("monthly");

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/billing/checkout`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ plan: "monthly" }),
    });
    expect(result).toEqual(mockResponse);
  });

  it("obtiene init_point para plan annual", async () => {
    const mockResponse = { init_point: "https://mercado-pago.com/checkout/456" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await checkout("annual");

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/billing/checkout`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ plan: "annual" }),
    });
    expect(result).toEqual(mockResponse);
  });

  it("maneja error 500", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    await expect(checkout("monthly")).rejects.toMatchObject({ status: 500 });
  });
});

describe("getSubscriptionStatus", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("obtiene estado active", async () => {
    const mockResponse = {
      status: "active" as const,
      plan: "monthly" as const,
      current_period_end: "2024-12-31",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await getSubscriptionStatus();

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/billing/status`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });
    expect(result).toEqual(mockResponse);
  });

  it("obtiene estado none", async () => {
    const mockResponse = {
      status: "none" as const,
      plan: null,
      current_period_end: null,
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await getSubscriptionStatus();

    expect(result).toEqual(mockResponse);
  });

  it("maneja error 401", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });

    await expect(getSubscriptionStatus()).rejects.toMatchObject({
      status: 401,
    });
  });
});

describe("cancelSubscription", () => {
  beforeEach(() => {
    mockGetApiUrl.mockReturnValue(BASE_URL);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("cancela subscription exitosamente", async () => {
    const mockResponse = {
      status: "cancelled" as const,
      plan: "monthly" as const,
      current_period_end: "2024-12-31",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await cancelSubscription();

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/billing/cancel`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    expect(result).toEqual(mockResponse);
  });

  it("maneja error 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "No subscription found",
    });

    await expect(cancelSubscription()).rejects.toMatchObject({
      status: 404,
    });
  });
});
