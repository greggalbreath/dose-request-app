import { D3V1Page } from './app.po';

describe('d3-v1 App', () => {
  let page: D3V1Page;

  beforeEach(() => {
    page = new D3V1Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
