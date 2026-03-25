import { test, expect } from "@playwright/test";
import { ProviderRegisterPage } from "../page-objects/provider-register.page";
import { uniqueEmail, TEST_PROVIDER } from "../fixtures/test-data";


/**
 * S1-03: Registro de proveedor (multi-step)
 *
 * Verifica:
 * - Flujo completo de 3 pasos
 * - Progreso entre pasos se preserva al navegar atrás
 * - Estado PENDING_VERIFICATION tras completar
 * - Redirect al dashboard del proveedor con banner
 */

test.describe("S1-03: Provider Registration (Multi-step)", () => {
  test("flujo completo de 3 pasos registra proveedor exitosamente", async ({
    page,
  }) => {
    const providerPage = new ProviderRegisterPage(page);
    const email = uniqueEmail("prov");

    await providerPage.goto();
    await providerPage.expectOnStep(1);

    // Step 1: Datos Personales
    await providerPage.fillStep1({
      firstName: TEST_PROVIDER.firstName,
      lastName: TEST_PROVIDER.lastName,
      email,
      phone: TEST_PROVIDER.phone,
      password: TEST_PROVIDER.password,
    });
    await providerPage.goNext();

    // Step 2: Perfil Profesional
    await providerPage.expectOnStep(2);
    await providerPage.fillStep2({
      category: TEST_PROVIDER.category,
      experience: TEST_PROVIDER.experience,
      description: TEST_PROVIDER.description,
    });
    await providerPage.goNext();

    // Step 3: Verificación (upload de documento)
    await providerPage.expectOnStep(3);

    // Crear un archivo de prueba para upload
    // Usamos un buffer como archivo dummy
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByText(/cargá|subí|documento/i).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: "dni-test.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-image-content"),
    });

    // Verificar que el archivo se subió
    await expect(page.getByText(/documento cargado|cargado/i)).toBeVisible({
      timeout: 5000,
    });

    // Enviar
    await providerPage.submit();

    // Debe redirigir al dashboard del proveedor
    await expect(page).toHaveURL(/\/dashboard\/proveedor/, { timeout: 15_000 });

    // Debe mostrar banner de verificación pendiente
    await expect(
      page.getByText(/verificación|pendiente|en proceso/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test("navegación atrás preserva datos del step anterior", async ({
    page,
  }) => {
    const providerPage = new ProviderRegisterPage(page);

    await providerPage.goto();

    // Llenar Step 1
    const firstName = "NavTest";
    await providerPage.fillStep1({
      firstName,
      lastName: TEST_PROVIDER.lastName,
      email: uniqueEmail("nav"),
      phone: TEST_PROVIDER.phone,
      password: TEST_PROVIDER.password,
    });
    await providerPage.goNext();
    await providerPage.expectOnStep(2);

    // Llenar Step 2
    await providerPage.fillStep2({
      category: TEST_PROVIDER.category,
      experience: TEST_PROVIDER.experience,
      description: TEST_PROVIDER.description,
    });

    // Volver a Step 1
    await providerPage.goPrev();
    await providerPage.expectOnStep(1);

    // Verificar que los datos se preservaron
    await expect(providerPage.firstNameInput).toHaveValue(firstName);
  });

  test("step 1 valida campos requeridos antes de avanzar", async ({
    page,
  }) => {
    const providerPage = new ProviderRegisterPage(page);
    await providerPage.goto();

    // Intentar avanzar sin llenar nada
    await providerPage.goNext();

    // Debería quedarse en Step 1 y mostrar errores
    await providerPage.expectOnStep(1);
    // Debe haber al menos un error de validación visible
    const errorMessages = page.locator('[role="alert"], .text-red-500, .text-destructive');
    await expect(errorMessages.first()).toBeVisible({ timeout: 5000 });
  });

  test("step 2 valida campos requeridos antes de avanzar", async ({
    page,
  }) => {
    const providerPage = new ProviderRegisterPage(page);
    await providerPage.goto();

    // Llenar Step 1 correctamente
    await providerPage.fillStep1({
      firstName: TEST_PROVIDER.firstName,
      lastName: TEST_PROVIDER.lastName,
      email: uniqueEmail("step2val"),
      phone: TEST_PROVIDER.phone,
      password: TEST_PROVIDER.password,
    });
    await providerPage.goNext();
    await providerPage.expectOnStep(2);

    // Intentar avanzar sin llenar Step 2
    await providerPage.goNext();

    // Debería quedarse en Step 2
    await providerPage.expectOnStep(2);
  });

  test("link a registro de cliente funciona", async ({ page }) => {
    const providerPage = new ProviderRegisterPage(page);
    await providerPage.goto();

    await page.getByRole("link", { name: /clic acá|cliente/i }).click();
    await expect(page).toHaveURL(/\/register$/);
  });
});
