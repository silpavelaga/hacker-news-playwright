import { test, expect } from '@playwright/test';
import { NewestPage, type Article } from '../pages/NewestPage';

test('the first 100 articles are sorted newest to oldest', async ({ page }) => {
  const newestPage = new NewestPage(page);
  const articleCount = 100;
  const articles: Article[] = [];

  await newestPage.goto();

  while (articles.length < articleCount) {
    const batch = await newestPage.readArticles(articleCount - articles.length);
    articles.push(...batch);

    if (articles.length < articleCount) {
      await newestPage.goToNextPage();
    }
  }

  expect(articles).toHaveLength(articleCount);
  expect(new Set(articles.map(article => article.id)).size, 'Articles should be unique')
    .toBe(articleCount);

  const timestamps = articles.map(getArticleTimestamp);

  for (let index = 1; index < articles.length; index++) {
    expect(
      timestamps[index - 1],
      `Article ${articles[index - 1].id} at position ${index} should be newer than or equal to ` +
        `article ${articles[index].id} at position ${index + 1}`,
    ).toBeGreaterThanOrEqual(timestamps[index]);
  }
});

function getArticleTimestamp(article: Article): number {
  const iso = article.timestamp.split(' ')[0];
  const timestamp = Date.parse(iso.endsWith('Z') ? iso : `${iso}Z`);
  expect(Number.isFinite(timestamp), `Invalid timestamp for article ${article.id}`).toBe(true);
  return timestamp;
}
