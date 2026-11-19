const repositoryList = document.querySelector("#repository-list");
const statusMessage = document.querySelector("#status");

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

  for (const repository of repositories) {
    const item = document.createElement("li");
    const card = document.createElement("article");
    const link = document.createElement("a");
    const description = document.createElement("p");
    const date = document.createElement("time");

    card.className = "repository-card";
    link.href = repository.url;
    link.textContent = repository.name;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    description.textContent = repository.description;
    date.dateTime = repository.starred_at;
    date.textContent = `Starred on ${formatDate(repository.starred_at)}`;

    card.append(link, description, date);
    item.append(card);
    repositoryList.append(item);
  }

  statusMessage.textContent = repositories.length
    ? `${repositories.length} repositories loaded.`
    : "No starred repositories yet.";
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Could not load repositories (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    renderRepositories(repositories);
  } catch (error) {
    statusMessage.textContent = "Could not load starred repositories. Please try again later.";
    console.error(error);
  }
}

loadRepositories();
