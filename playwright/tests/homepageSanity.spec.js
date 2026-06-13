const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');

test.describe('Homepage Sanity', () => {

    test('Contact form is visible on the homepage', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.scrollToContact();

        await expect(homePage.contactSection).toBeVisible();
        await expect(homePage.contactName).toBeVisible();
        await expect(homePage.contactEmail).toBeVisible();
        await expect(homePage.contactPhone).toBeVisible();
        await expect(homePage.contactSubject).toBeVisible();
        await expect(homePage.contactMessage).toBeVisible();
    });

    test('"Book now" buttons are present for listed room types', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();

        const count = await homePage.getBookNowCount();
        console.log(`Found ${count} "Book now" link(s) on homepage`);
        expect(count).toBeGreaterThan(0);
    });

});