const { test, expect } = require('@playwright/test');
const { AdminPage } = require('../pages/AdminPage');

test.describe('Admin Authentication & Dashboard', () => {

    test('Admin login redirects to Dashboard and Logout button is present', async ({ page }) => {
        const adminPage = new AdminPage(page);
        await adminPage.navigate();

        expect(await adminPage.isOnLoginPage()).toBeTruthy();

        await adminPage.login('admin', 'password');

        expect(await adminPage.getCurrentUrl()).not.toMatch(/.*login.*/);

        expect(await adminPage.isLoggedIn()).toBeTruthy();
        await expect(adminPage.roomsNavLink).toBeVisible();
    });

    test('(Bonus) Room details in admin panel match the public homepage', async ({ page }) => {
        const roomResponse = await page.request.get('https://automationintesting.online/api/room');
        const roomData = await roomResponse.json();
        const firstRoom = roomData.rooms[0];

        const expectedName = firstRoom.roomName;
        const expectedType = firstRoom.type;
        const expectedPrice = String(firstRoom.roomPrice);

        console.log(`Homepage room: ${expectedName} | Type: ${expectedType} | Price: £${expectedPrice}`);

        const adminPage = new AdminPage(page);
        await adminPage.navigate();
        await adminPage.login('admin', 'password');

        await expect(page.getByText(expectedName).first()).toBeVisible();
        await expect(page.getByText(expectedType).first()).toBeVisible();
        await expect(page.getByText(expectedPrice).first()).toBeVisible();

        console.log(`Admin confirmed: Room ${expectedName} (${expectedType}) at £${expectedPrice}`);
    });

});