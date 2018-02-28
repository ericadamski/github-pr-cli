const fs = require("fs");
const { Observable } = require("rxjs");
const { removeToken } = require("../helpers/helpers");
const { ROOT_DIR, TOKEN_LOCATION } = require("../../constants");

const { isAuthorized } = require("../is-authorized");

describe(".isAuthorized", () => {
  it("should be a function with arity 0", () => {
    // Assert
    expect(typeof isAuthorized).toBe("function");
    expect(isAuthorized).toHaveLength(0);
  });

  it("should return an Observable of the token if authorized", () => {
    // Arrange
    const token = "token";
    fs.rmdirSync(ROOT_DIR);
    fs.mkdirSync(ROOT_DIR);
    fs.writeFileSync(TOKEN_LOCATION, token);

    // Act
    const result$ = isAuthorized();

    // Assert
    expect(result$ instanceof Observable).toBeTruthy();

    return result$.toPromise().then(t => {
      expect(t).not.toBeUndefined();
      expect(typeof t).toBe("string");
      expect(t).toEqual(token);

      return removeToken().toPromise();
    });
  });

  it("should return on Observable of false otherwise", () => {
    // Act
    const result$ = isAuthorized();

    // Assert
    expect(result$ instanceof Observable).toBeTruthy();

    return result$.toPromise().then(token => {
      expect(token).toBeFalsy();
    });
  });
});
