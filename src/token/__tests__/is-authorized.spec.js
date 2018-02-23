const fs = require("fs");
const { Observable } = require("rxjs");

const { isAuthorized, ROOT_DIR } = require("../is-authorized");

describe(".isAuthorized", () => {
  it("should be a function with arity 0", () => {
    // Assert
    expect(typeof isAuthorized).toBe("function");
    expect(isAuthorized).toHaveLength(0);
  });

  it("should return an Observable of the token if authorized", () => {
    // Arrange
    fs.rmdirSync(ROOT_DIR);
    fs.mkdirSync(ROOT_DIR);

    // Act
    const result$ = isAuthorized();

    // Assert
    expect(result$ instanceof Observable).toBeTruthy();

    return result$.toPromise().then(token => {
      expect(token).not.toBeUndefined();
      expect(typeof token).toBe("string");
      // fs.unlinkSync(TOKEN_LOCATION);
    });
  });

  it("should return on Observable of undefined otherwise", () => {
    // Act
    const result$ = isAuthorized();

    // Assert
    expect(result$ instanceof Observable).toBeTruthy();

    return result$.toPromise().then(token => {
      expect(token).toBeUndefined();
    });
  });
});
