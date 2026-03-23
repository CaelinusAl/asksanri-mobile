/**
 * Expo / Jest altyapısı çalışıyor mu — projeyi import etmeden hızlı doğrulama.
 * Ekran testleri için sonra @testing-library/react-native eklenebilir.
 */
describe("asksanri-mobile", () => {
  it("jest + jest-expo çalışır", () => {
    expect(1 + 1).toBe(2);
  });

  it("Expo SDK sürümü tanımlıdır", () => {
    const pkg = require("../package.json");
    expect(pkg.dependencies.expo).toMatch(/^~/);
  });
});
