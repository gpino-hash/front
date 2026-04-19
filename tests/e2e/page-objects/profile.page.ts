import { type Page, type Locator, expect } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;
  readonly personalTab: Locator;
  readonly securityTab: Locator;
  readonly professionalTab: Locator;

  // Personal data fields
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly saveButton: Locator;

  // Security fields
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmNewPasswordInput: Locator;
  readonly updatePasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.personalTab = page.getByRole("tab", { name: /datos personales/i });
    this.securityTab = page.getByRole("tab", { name: /seguridad/i });
    this.professionalTab = page.getByRole("tab", { name: /perfil profesional/i });

    this.firstNameInput = page.getByLabel("Nombre");
    this.lastNameInput = page.getByLabel("Apellido");
    this.phoneInput = page.getByLabel("Teléfono");
    this.saveButton = page.getByRole("button", { name: /guardar cambios/i });

    this.currentPasswordInput = page.getByLabel("Contraseña actual");
    this.newPasswordInput = page.getByLabel("Nueva contraseña");
    this.confirmNewPasswordInput = page.getByLabel("Confirmar nueva");
    this.updatePasswordButton = page.getByRole("button", { name: /actualizar contraseña/i });
  }

  async goto() {
    await this.page.goto("/perfil");
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL(/\/perfil/);
  }

  async expectUserName(name: string | RegExp) {
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async expectUserEmail(email: string) {
    await expect(this.page.getByText(email)).toBeVisible();
  }

  async editPersonalData(data: { firstName?: string; lastName?: string; phone?: string }) {
    if (data.firstName) {
      await this.firstNameInput.clear();
      await this.firstNameInput.fill(data.firstName);
    }
    if (data.lastName) {
      await this.lastNameInput.clear();
      await this.lastNameInput.fill(data.lastName);
    }
    if (data.phone) {
      await this.phoneInput.clear();
      await this.phoneInput.fill(data.phone);
    }
    await this.saveButton.click();
  }

  async changePassword(current: string, newPass: string) {
    await this.securityTab.click();
    await this.currentPasswordInput.fill(current);
    await this.newPasswordInput.fill(newPass);
    await this.confirmNewPasswordInput.fill(newPass);
    await this.updatePasswordButton.click();
  }

  async expectSuccessMessage(message: string | RegExp) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}