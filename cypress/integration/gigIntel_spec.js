const { getDefaultNormalizer } = require("@testing-library/dom");

describe("gigIntel", () => {
  it("user can view venues and create review", () => {
    // visit page
    cy.visit("localhost:3000");
    // register
    cy.findByRole("link", { name: /register/i }).click();
    cy.findByRole("textbox", { name: /username/i }).type("jim9");
    cy.findByRole("textbox", { name: /email/i }).type("jim9@gmail.com");
    cy.findByLabelText(/password/i).type("password");
    cy.findByRole("button", { name: /register/i }).click();
    // click home
    cy.findByRole("link", { name: /home/i }).click();
    // view venues
    cy.findByRole("link", { name: /view venues/i }).click();
    // view venue
    cy.findByRole("link", { name: /view amsterdam bar and hall/i }).click();
    // leave review
    //cy.findByText(/3 stars/i).click();
    cy.get("textarea", { name: /review[body]/i }).type("test review", {
      force: true,
    });
    //cy.findByRole("textbox", { name: /review text/i }).type("test review");
    cy.findByRole("button", { name: /submit/i }).click();
    // delete review
    cy.findByRole("button", { name: /delete/i }).click();
    // log out
    cy.findByRole("link", { name: /logout/i }).click();
  });
});
