import { type Page, type Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly googleButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Correo Electrónico");
    this.passwordInput = page.getByLabel("Contraseña");
    this.submitButton = page.getByRole("button", { name: /iniciar sesión/i });
    this.googleButton = page.getByRole("button", { name: /google/i });
    this.forgotPasswordLink = page.getByRole("link", { name: /olvidaste tu contraseña/i });
    this.registerLink = page.getByRole("link", { name: /registrate/i }).first();
    this.rememberMeCheckbox = page.getByLabel(/recordarme/i);
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.submitButton).toBeVisible();
  }

  async expectError(message: string | RegExp) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectLoading() {
    await expect(this.page.getByText(/procesando/i)).toBeVisible();
  }
}