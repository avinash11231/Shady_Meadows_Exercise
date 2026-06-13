class HomePage {
    constructor(page) {
        this.page = page;

        this.contactSection = page.locator('#contact');
        this.contactName = page.locator('#contact').getByText('Name');
        this.contactEmail = page.locator('#contact').getByText('Email');
        this.contactPhone = page.locator('#contact').getByText('Phone');
        this.contactSubject = page.locator('#contact').getByText('Subject');
        this.contactMessage = page.locator('#contact').getByText('Message', { exact: true });
        this.bookNowLinks = page.getByRole('link', { name: 'Book now' });
    }

    async navigate() {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
    }

    async scrollToContact() {
        await this.contactSection.scrollIntoViewIfNeeded();
    }

    async getBookNowCount() {
        return await this.bookNowLinks.count();
    }
}

module.exports = { HomePage };