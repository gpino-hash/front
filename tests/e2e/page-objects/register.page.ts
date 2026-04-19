import { type Page, type Locator, expect } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly googleButton: Locator;
  readonly providerLink: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByLabel("Nombre");
    this.lastNameInput = page.getByLabel("Apellido");
    this.emailInput = page.getByLabel("Correo electrónico");
    this.phoneInput = page.getByLabel("Teléfono");
    this.passwordInput = page.getByLabel("Contraseña", { exact: true });
    this.confirmPasswordInput = page.getByLabel("Confirmar");
    this.submitButton = page.getByRole("button", { name: /crear cuenta/i });
    this.googleButton = page.getByRole("button", { name: /google/i });
    this.providerLink = page.getByRole("link", { name: /profesional/i });
    this.loginLink = page.getByRole("link", { name: /iniciar sesión/i });
  }

  async goto() {
    await this.page.goto("/register");
  }

  async fillForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    await this.fillForm(data);
    await this.submit();
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL(/\/register/);
    await expect(this.submitButton).toBeVisible();
  }

  async expectError(message: string | RegExp) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}