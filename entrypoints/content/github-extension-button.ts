const services = [
  { name: "GitIngest", baseUrl: "https://gitingest.com" },
  { name: "GitDiagram", baseUrl: "https://gitdiagram.com" },
];

export async function createGitHubExtensionDropdown(): Promise<HTMLLIElement> {
  const li = document.createElement("li");
  li.className = "d-inline-block";
  // Add a unique ID to easily find the dropdown
  li.id = "github-extension-dropdown";

  // Create dropdown container using GitHub's native dropdown classes
  const details = document.createElement("details");
  details.className = "details-overlay details-reset position-relative";

  const summary = document.createElement("summary");
  summary.className = "btn-sm btn";
  summary.setAttribute("aria-haspopup", "true");
  summary.role = "button";

  // Add button text with dropdown arrow
  summary.innerHTML = `
    <span>Open in...</span>
    <span class="dropdown-caret"></span>
  `;

  // Create dropdown menu using GitHub's dropdown styling
  const dropdown = document.createElement("div");
  dropdown.className = "dropdown-menu dropdown-menu-sw";
  dropdown.style.width = "200px";

  // Create dropdown list
  const dropdownList = document.createElement("ul");
  dropdownList.className = "list-style-none";

  // Populate dropdown with service options
  services.forEach((service) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.className = "pl-3 pr-3 py-2 d-block text-normal";
    link.href = window.location.href.replace(
      "github.com",
      new URL(service.baseUrl).hostname,
    );
    link.innerText = service.name;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    item.appendChild(link);
    dropdownList.appendChild(item);
  });

  dropdown.appendChild(dropdownList);
  details.appendChild(summary);
  details.appendChild(dropdown);
  li.appendChild(details);

  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    if (!details.contains(event.target as Node)) {
      details.removeAttribute("open");
    }
  });

  return li;
}

// Function to insert dropdown into GitHub UI
export function appendGitHubExtensionDropdown(button: HTMLElement) {
  const actionsList = document.querySelector(
    "#repository-details-container > ul",
  );
  if (actionsList) {
    actionsList.appendChild(button);
  }
}
