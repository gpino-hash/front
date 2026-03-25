import { type Page, type Locator, expect } from "@playwright/test";

export class ForgotPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly backToLoginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Correo Electrónico");
    this.submitButton = page.getByRole("button", { name: /enviar instrucciones/i });
    this.backToLoginLink = page.getByRole("link", { name: /volver al login/i });
  }

  async goto() {
    await this.page.goto("/forgot-password");
  }

  async requestReset(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async expectSuccessState() {
    await expect(this.page.getByText(/revisá tu correo/i)).toBeVisible();
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL(/\/forgot-password/);
    await expect(this.submitButton).toBeVisible();
  }
}