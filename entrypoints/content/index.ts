import {
  createGitHubExtensionDropdown,
  appendGitHubExtensionDropdown,
} from "./github-extension-button";
import { PageObserver } from "./page-observer";

export default defineContentScript({
  matches: ["*://*.github.com/*"],
  main() {
    const isRepoPage = () => window.location.pathname.match(/^\/[^/]+\/[^/]+/);

    let isCreatingButton = false;

    const manageDropdown = () => {
      // Check for existing dropdown by ID
      const existingDropdown = document.getElementById("github-extension-dropdown");

      if (isRepoPage()) {
        if (!existingDropdown && !isCreatingButton) {
          isCreatingButton = true;
          createGitHubExtensionDropdown()
            .then((dropdown) => {
              appendGitHubExtensionDropdown(dropdown);
              isCreatingButton = false;
            })
            .catch((error) => {
              console.error("Failed to create GitHub extension dropdown:", error);
              isCreatingButton = false;
            });
        }
      } else if (existingDropdown) {
        // Remove dropdown if not on a repo page
        existingDropdown.remove();
      }
    };

    // Set up initial state
    manageDropdown();
    
    // Use PageObserver to watch for navigation changes
    const observer = new PageObserver(manageDropdown);
  },
});
