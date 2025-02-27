// Throttle function to limit the rate of execution
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

export class PageObserver {
  private observer: MutationObserver;
  private bodyObserver: MutationObserver;
  private callback: () => void;

  constructor(callback: () => void) {
    this.callback = throttle(callback, 250);
    this.setupObservers();
    this.setupNavigationEvents();
  }

  private setupObservers() {
    // Main content observer
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          this.callback();
          break;
        }
      }
    });

    // Observe initial container if it exists
    this.observeMainContainer();

    // Watch for container changes
    this.bodyObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          this.observeMainContainer();
        }
      }
    });

    this.bodyObserver.observe(document.body, { childList: true });
  }

  private observeMainContainer() {
    const mainContainer = document.querySelector('#js-repo-pjax-container');
    if (mainContainer && !this.observer.takeRecords().length) {
      this.observer.observe(mainContainer, { 
        childList: true,
        subtree: true 
      });
    }
  }

  private setupNavigationEvents() {
    window.addEventListener('popstate', this.callback);
    window.addEventListener('pushstate', this.callback);
    window.addEventListener('replacestate', this.callback);
  }

  public disconnect() {
    this.observer.disconnect();
    this.bodyObserver.disconnect();
    window.removeEventListener('popstate', this.callback);
    window.removeEventListener('pushstate', this.callback);
    window.removeEventListener('replacestate', this.callback);
  }
}
