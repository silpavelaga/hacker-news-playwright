import type { Locator, Page } from '@playwright/test';

export interface Article {
  id: string;
  timestamp: string;
}

export class NewestPage {
  readonly articleRows: Locator;
  readonly moreLink: Locator;

  constructor(private readonly page: Page) {
    this.articleRows = page.locator('tr.athing');
    this.moreLink = page.getByRole('link', { name: 'More', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('/newest', { waitUntil: 'domcontentloaded' });
  }

  async readArticles(limit: number): Promise<Article[]> {
    await this.articleRows.first().waitFor({ state: 'visible' });

    return this.articleRows.evaluateAll((elements, count) =>
      elements.slice(0, count).map((row) => ({
        id: row.getAttribute('id') ?? '',
        timestamp: row.nextElementSibling?.querySelector('.age')?.getAttribute('title') ?? '',
      })), limit);
  }

  async goToNextPage(): Promise<void> {
    const previousUrl = this.page.url();
    await Promise.all([
      this.page.waitForURL((url) => url.href !== previousUrl, { waitUntil: 'domcontentloaded' }),
      this.moreLink.click(),
    ]);
  }
}
