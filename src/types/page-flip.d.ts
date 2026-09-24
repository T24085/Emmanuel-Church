declare module "page-flip" {
  export class PageFlip {
    constructor(
      element: HTMLElement,
      settings: Record<string, string | number | boolean>,
    );
    loadFromHTML(elements: HTMLElement[] | NodeListOf<HTMLElement>): void;
    on(
      event: string,
      callback: (event: { data: number | string }) => void,
    ): void;
    flipNext(): void;
    flipPrev(): void;
    turnToPage(page: number): void;
    getCurrentPageIndex(): number;
    destroy(): void;
  }
}
