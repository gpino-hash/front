import { type Page, type Locator, expect } from "@playwright/test";

export class ProviderRegisterPage {
  readonly page: Page;

  // Step 1 - Datos Personales
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;

  // Step 2 - Perfil Profesional
  readonly categorySelect: Locator;
  readonly experienceInput: Locator;
  readonly descriptionInput: Locator;

  // Navigation
  readonly nextButton: Locator;
  readonly prevButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Step 1
    this.firstNameInput = page.getByLabel("Nombre");
    this.lastNameInput = page.getByLabel("Apellido");
    this.emailInput = page.getByLabel("Email profesional");
    this.phoneInput = page.getByLabel("Teléfono de contacto");
    this.passwordInput = page.getByLabel("Contraseña");
    // Step 2
    this.categorySelect = page.getByLabel("Categoría principal");
    this.experienceInput = page.getByLabel("Años de experiencia");
    this.descriptionInput = page.getByLabel(/descripción/i);
    // Nav
    this.nextButton = page.getByRole("button", { name: /siguiente/i });
    this.prevButton = page.getByRole("button", { name: /anterior/i });
    this.submitButton = page.getByRole("button", { name: /enviar datos/i });
  }

  async goto() {
    await this.page.goto("/register/provider");
  }

  async fillStep1(data: {
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
  }

  async fillStep2(data: {
    category: string;
    experience: string;
    description: string;
  }) {
    await this.categorySelect.selectOption({ label: data.category });
    await this.experienceInput.fill(data.experience);
    await this.descriptionInput.fill(data.description);
  }

  async uploadDocument(filePath: string) {
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
  }

  async goNext() {
    await this.nextButton.click();
  }

  async goPrev() {
    await this.prevButton.click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectOnStep(step: 1 | 2 | 3) {
    const stepHeadings = {
      1: /datos personales/i,
      2: /perfil profesional/i,
      3: /verificación/i,
    };
    await expect(
      this.page.getByRole("heading", { name: stepHeadings[step] })
    ).toBeVisible({ timeout: 5000 });
  }

  async expectError(message: string | RegExp) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
