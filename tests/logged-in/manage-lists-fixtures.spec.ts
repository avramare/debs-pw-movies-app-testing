import { expect } from '@playwright/test';
import { listTest as test } from '../helpers/list-test';
import { addMovie } from '../helpers/list-utilities';

test('editing an existing list', async ({ listPage }) => {
  // set the page to the listPage fixture
  const page = listPage;

  await page.getByRole('link', { name: 'Edit' }).click();

  await test.step('update list name and description', async () => {
    await page.getByLabel('Name').fill('my action movies');
    await page.getByLabel('Description').fill('my favorite action movies');
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify that the list name and description have been updated
    await expect.soft(page.getByLabel('Name')).toHaveValue('my action movies');
    await expect
      .soft(page.getByLabel('Description'))
      .toHaveValue('my favorite action movies');
    await page.getByRole('button', { name: 'Save' }).click();
  });

  await test.step('verify updated list name and description on my list page', async () => {
    await page.getByRole('link', { name: 'View List' }).click();
    await expect
      .soft(page.getByRole('heading', { level: 1 }))
      .toHaveText('my action movies');
    await expect.soft(page.getByRole('heading').nth(1)).toHaveText(
      'my favorite action movies',
    );
  });
});

test('adding movies to a list', async ({ listPage }) => {
  // set the page to the listPage fixture
  const page = listPage;
  await page.getByRole('button', { name: 'Add/Remove Movies' }).click();

  await addMovie(page, 'Inside Out 2');
  await addMovie(page, 'Gunner');

  // Verify that the movies have been added to the list
  await expect.soft(page.getByRole('listitem', { name: 'movie' })).toHaveText([
    /Twisters/,
    /The Garfield Movie/,
    /Bad Boys: Ride or Die/,
    /Inside Out 2/,
    /Gunner/,
  ]);
});

test('deleting movies from a list', async ({ listPage }) => {
  // set the page to the listPage fixture
  const page = listPage;

  await page.getByRole('button', { name: 'Add/Remove Movies' }).click();
  await expect
    .soft(page.getByRole('listitem', { name: 'movie' }))
    .toHaveText([/Twisters/, /The Garfield Movie/, /Bad Boys: Ride or Die/]);

  await test.step('delete the second movie from list', async () => {
    const movie2 = page
      .getByRole('listitem')
      .filter({ hasText: /The Garfield Movie/ });
    await movie2.getByLabel('Remove').click();
  });

  await expect.soft(page.getByRole('listitem', { name: 'movie' })).toHaveText([
    /Twisters/,
    /Bad Boys: Ride or Die/,
  ]);
});

test('sharing a list', async ({ listPage }) => {
  // set the page to the listPage fixture
  const page = listPage;

  await page.getByRole('button', { name: 'Share' }).click();
  await expect
    .soft(page.getByRole('dialog').getByRole('heading'))
    .toHaveText('Share my favorite movies');

  // Verify that the URL input in the dialog contains a value with "list"
  await expect
    .soft(page.getByRole('dialog').getByLabel('URL'))
    .toHaveValue(/list/);

  await test.step('close the share dialog', async () => {
    // Close the dialog by clicking outside of it
    await page.locator('body').click({ position: { x: 0, y: 0 } });
    await expect.soft(page.getByRole('dialog')).not.toBeVisible();
  });
});

test('deleting a list', async ({ listPage }) => {
  // set the page to the listPage fixture
  const page = listPage;

  await page.getByRole('link', { name: 'Edit' }).click();
  await page.getByRole('link', { name: 'Delete List' }).click();

  await test.step('confirm the deletion', async () => {
    await page.getByLabel(/Click the button below/).click();
    await page.getByRole('button', { name: 'Yes' }).click();
  });

  // Verify that the list has been deleted
  await expect.soft(page).toHaveURL(/my-lists/);
  await expect
    .soft(page.getByRole('heading', { level: 3 }))
    .toHaveText(/no lists/);
  await expect.soft(page.getByRole('listitem', { name: 'movie' })).toHaveCount(0);
});
