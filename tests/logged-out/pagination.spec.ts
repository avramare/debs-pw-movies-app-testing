import { test, expect } from '@playwright/test';

test('pagination', async ({ page }) => {
  await page.goto('');

  const movies = page.getByRole('listitem', { name: 'movie' });

  await test.step('navigate to page 2', async () => {
    await page.getByRole('button', { name: 'Page 2' }).click();
    await expect.soft(movies).toHaveCount(20);
    await expect.soft(page).toHaveURL(/page=2/);
    await expect
      .soft(page.getByRole('button', { name: 'Page 1' }))
      .toBeVisible();
    await expect.soft(page.getByRole('button', { name: 'Page 3' })).toBeVisible();
  });

  await test.step('navigate back to page 1', async () => {
    await page.getByRole('button', { name: 'Page 1' }).click();
    await expect.soft(movies).toHaveCount(20);
    await expect.soft(page).toHaveURL(/page=1/);
    await expect
      .soft(page.getByRole('button', { name: 'Page 2' }))
      .toBeVisible();
    await expect.soft(
      page.getByRole('button', { name: 'Page 1' }),
    ).not.toBeVisible();
  });
});
