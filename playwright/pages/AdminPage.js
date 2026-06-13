class AdminPage {
    constructor(page) {
        this.page = page;

        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.logoutButton = page.getByRole('button', { name: 'Logout' });
        this.roomsNavLink = page.getByRole('link', { name: 'Rooms' }).first();
    }

    async navigate() {
        await this.page.goto('/admin');
        await this.page.waitForLoadState('networkidle');
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async isOnLoginPage() {
        return await this.loginButton.isVisible();
    }

    async isLoggedIn() {
        return await this.logoutButton.isVisible();
    }

    async getCurrentUrl() {
        return this.page.url();
    }
}

module.exports = { AdminPage };