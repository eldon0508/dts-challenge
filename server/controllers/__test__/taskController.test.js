const db = require("../../database");
const controller = require("../taskController");

const mockIndexDatas = [
  {
    id: 1,
    title: "Task 1",
    description: "Test task 1",
    status: "Completed",
    due_date: "2025-01-01",
  },
  {
    id: 2,
    title: "Task 2",
    description: "Test task 2",
    status: "Completed",
    due_date: "2025-01-02",
  },
  {
    id: 3,
    title: "Task 3",
    description: "",
    status: "Uncompleted",
    due_date: "2025-01-03",
  },
];

describe("taskController index function, get all existing entries from the database", () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should return a 200 status and all datas from the database", async () => {
    db.query = jest.fn().mockResolvedValue(mockIndexDatas);

    await controller.index(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: mockIndexDatas });
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM tasks");
  });
});

describe("taskController store function, store a new entry into the database", () => {
  let mockStoreEntry;
  let mockRequest;
  let mockResponse;
  let mockQueryResult;
  let consoleErrorSpy;

  beforeEach(() => {
    mockStoreEntry = {
      id: 4,
      title: "Task 4",
      description: "Task text 4",
      status: "Uncompleted",
      dDate: "2025-01-04",
    };
    mockRequest = { body: mockStoreEntry };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockQueryResult = { rowCount: 1 };
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test("should return a 201 status and store the request into database", async () => {
    db.query = jest.fn().mockResolvedValue(mockQueryResult);

    await controller.store(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
    expect(db.query).toHaveBeenCalledWith(
      "INSERT INTO tasks (title, description, status, due_date) VALUES ($1, $2, $3, $4)",
      [mockStoreEntry.title, mockStoreEntry.description, mockStoreEntry.status, mockStoreEntry.dDate]
    );
    expect(consoleErrorSpy).not.toHaveBeenCalledWith();
  });

  test("should return 500 status and json with success false", async () => {
    const mockError = new Error("Database error");
    db.query = jest.fn().mockRejectedValue(mockError);

    await controller.store(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: false });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Task insert error:", mockError);
  });
});

describe("taskController edit function, return a selected entry for editing from database", () => {
  let mockEditData;
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockEditData = [
      {
        id: 1,
        title: "Task 1",
        description: "Test task 1",
        status: "Completed",
        due_date: "2025-01-01",
      },
    ];
    mockRequest = { params: { id: 1 } };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should return a 200 status and data from the database", async () => {
    db.query = jest.fn().mockResolvedValue([mockEditData]);

    await controller.edit(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: mockEditData });
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM tasks WHERE id = $1", [1]);
  });
});

describe("taskController update function, update an existing entry in database", () => {
  let mockRequest;
  let mockResponse;
  let mockQueryResult;
  let consoleErrorSpy;

  beforeEach(() => {
    mockUpdateEntry = {
      id: 1,
      title: "Task 1",
      description: "Test task 1",
      status: "Completed",
      dDate: "2025-01-05",
    };
    mockRequest = {
      body: mockUpdateEntry,
      params: { id: "1" },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockQueryResult = { rowCount: 1 };
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test("should return a 200 status and store the data to database", async () => {
    db.query = jest.fn().mockResolvedValue(mockQueryResult);

    await controller.update(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
    expect(db.query).toHaveBeenCalledWith(
      "UPDATE tasks SET title = $1, description = $2, status = $3, due_date = $4 WHERE id = $5",
      [
        mockUpdateEntry.title,
        mockUpdateEntry.description,
        mockUpdateEntry.status,
        mockUpdateEntry.dDate,
        mockRequest.params.id.toString(),
      ]
    );
    expect(consoleErrorSpy).not.toHaveBeenCalledWith();
  });

  test("should return 500 status and json with success false", async () => {
    const mockError = new Error("Database error");
    db.query = jest.fn().mockRejectedValue(mockError);

    await controller.update(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: false });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Task update error:", mockError);
  });
});

describe("taskController destroy function, soft-delete an existing entry in database", () => {
  let mockRequest;
  let mockResponse;
  let mockQueryResult;
  let consoleErrorSpy;

  beforeEach(() => {
    mockRequest = {
      params: { id: "1" },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockQueryResult = { rowCount: 1 };
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test("should return a 200 status and soft delete the data from database", async () => {
    db.query = jest.fn().mockResolvedValue(mockQueryResult);

    await controller.destroy(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
    expect(db.query).toHaveBeenCalledWith("DELETE FROM tasks WHERE id = $1", [mockRequest.params.id.toString()]);
    expect(consoleErrorSpy).not.toHaveBeenCalledWith();
  });

  test("should return 500 status and json with success false", async () => {
    const mockError = new Error("Database error");
    db.query = jest.fn().mockRejectedValue(mockError);

    await controller.destroy(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: false });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Task destroy error:", mockError);
  });
});
