import fs from "fs";
import { join } from "path";
import tempDir from "temp-dir";
import tmp from "tmp-promise";
import { promisify } from "util";
import { File } from "../template";
import { writeFiles } from "../write";

jest.mock("signale");

const readFile = promisify(fs.readFile);

let tmpDir: tmp.DirectoryResult;
let files: File[];

function readTmpFile(path: string) {
  return readFile(join(tmpDir.path, path), "utf8");
}

beforeEach(async () => {
  tmpDir = await tmp.dir({ dir: tempDir, unsafeCleanup: true });
  await writeFiles(tmpDir.path, files);
});

afterEach(() => tmpDir.cleanup());

describe("given files", () => {
  beforeAll(() => {
    files = [
      { path: "foo", content: "bar" },
      { path: "bar/baz", content: "baz" }
    ];
  });

  test("should write foo", async () => {
    expect(await readTmpFile("foo")).toEqual("bar");
  });

  test("should write bar/baz", async () => {
    expect(await readTmpFile("bar/baz")).toEqual("baz");
  });
});
