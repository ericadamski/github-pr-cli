const { Observable } = require("rxjs");
const { EOL } = require("os");
const fs = require("fs");

const { ROOT_DIR, TOKEN_LOCATION } = require("../../../constants");
const {
  writeToken,
  readToken,
  removeToken,
  doesTokenDirectoryExist
} = require("../helpers");

const noop = () => null;

describe("helpers", () => {
  describe(".doesTokenDirectoryExist", () => {
    afterAll(() =>
      removeToken()
        .toPromise()
        .then(() => fs.rmdirSync(ROOT_DIR))
    );

    it("should be a function with arity 0", () => {
      // Assert
      expect(typeof doesTokenDirectoryExist).toBe("function");
      expect(doesTokenDirectoryExist).toHaveLength(0);
    });

    it("should return an Observable of false if the directory does NOT exists", async () => {
      // Arrange
      try {
        fs.accessSync(ROOT_DIR);
        fs.rmdirSync(ROOT_DIR);
      } catch (e) {
        // nohting the directory already doesn't exist.
      }

      // Act
      const result$ = doesTokenDirectoryExist();

      // Assert
      expect(result$ instanceof Observable).toBeTruthy();

      return result$.toPromise().then(exists => expect(exists).toBeFalsy());
    });

    it("should return an Observable of true if the directory does exists", () => {
      // Arrange
      try {
        fs.accessSync(ROOT_DIR);
      } catch (e) {
        fs.mkdirSync(ROOT_DIR);
      }

      // Act
      const result$ = doesTokenDirectoryExist();

      // Assert
      expect(result$ instanceof Observable).toBeTruthy();

      return result$.toPromise().then(exists => expect(exists).toBeTruthy());
    });
  });

  describe(".writeToken", () => {
    afterAll(() => {
      fs.unlinkSync(TOKEN_LOCATION);
      fs.rmdirSync(ROOT_DIR);
    });

    it("should be a function with arity 1", () => {
      // Assert
      expect(typeof writeToken).toBe("function");
      expect(writeToken).toHaveLength(1);
    });

    it("should create the directory needed and create the file requried with the token inside", () => {
      // Arrange
      try {
        fs.unlinkSync(TOKEN_LOCATION);
      } catch (e) {
        // the file already doesn't exist
      }

      try {
        fs.rmdirSync(ROOT_DIR);
      } catch (e) {
        // the directory already doesn't exist
      }

      const token = "some token";

      // Act
      const result$ = writeToken(token);

      // Assert
      expect(result$ instanceof Observable).toBeTruthy();

      return result$.toPromise().then(t => {
        expect(t).toEqual(token);
        expect(fs.accessSync(TOKEN_LOCATION)).toBeUndefined();
      });
    });
  });

  describe(".readToken", () => {
    it("should be a function with arity 0", () => {
      // Assert
      expect(typeof readToken).toBe("function");
      expect(readToken).toHaveLength(0);
    });

    it("should return an Observable of the token", async () => {
      // Arrange
      const token = "some token";
      await writeToken(token).toPromise();

      // Act
      const result$ = readToken();

      // Assert
      expect(result$ instanceof Observable).toBeTruthy();

      return result$.toPromise().then(t => {
        expect(t).not.toBeUndefined();
        expect(t).toEqual(`${token}${EOL}`);
      });
    });
  });

  describe(".removeToken", () => {
    it("should be a function with arity 0", () => {
      // Assert
      expect(typeof removeToken).toBe("function");
      expect(removeToken).toHaveLength(0);
    });

    it("should unlink the file", async () => {
      // Arrange
      const token = "some token";
      await writeToken(token).toPromise();

      // Act
      const result$ = removeToken();

      // Assert
      expect(result$ instanceof Observable).toBeTruthy();

      return result$
        .toPromise()
        .then(
          () =>
            new Promise((resolve, reject) =>
              fs.access(TOKEN_LOCATION, err => (err ? reject(err) : resolve()))
            )
        )
        .then(() => fail("File should not exist."))
        .catch(e =>
          expect(e.message.includes("no such file or directory")).toBeTruthy()
        );
    });
  });
});
