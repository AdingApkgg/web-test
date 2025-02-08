document.addEventListener("DOMContentLoaded", function () {
  // Initialize Pjax
  var pjax = new Pjax({
    selectors: ["title", "main"],
    cacheBust: false,
  });

  // Handle Pjax events
  document.addEventListener("pjax:complete", function () {
    // Reinitialize any scripts or styles after Pjax load
  });
});

function initDarkMode() {
  const themeToggle = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme") || "light";

  document.documentElement.setAttribute("data-theme", currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const newTheme =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }
}

document.addEventListener("DOMContentLoaded", initDarkMode);

document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  let searchIndex = [];

  // 加载搜索索引
  fetch("/searchindex.json")
    .then((response) => response.json())
    .then((data) => {
      searchIndex = data;
    })
    .catch((error) => console.error("Error loading search index:", error));

  // 处理搜索
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = searchInput.value.toLowerCase();
    const results = searchIndex.filter((page) => {
      return (
        page.title.toLowerCase().includes(query) ||
        page.content.toLowerCase().includes(query)
      );
    });

    displayResults(results);
  });

  // 显示搜索结果
  function displayResults(results) {
    searchResults.innerHTML = "";
    if (results.length === 0) {
      searchResults.innerHTML = "<p>No results found.</p>";
      return;
    }

    const ul = document.createElement("ul");
    results.forEach((page) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = page.permalink;
      a.textContent = page.title;
      li.appendChild(a);
      ul.appendChild(li);
    });
    searchResults.appendChild(ul);
  }
});

searchInput.addEventListener("input", function () {
  const query = searchInput.value.toLowerCase();
  const results = searchIndex.filter((page) => {
    return (
      page.title.toLowerCase().includes(query) ||
      page.content.toLowerCase().includes(query)
    );
  });
  displayResults(results);
});

function highlightText(text, query) {
  return text.replace(
    new RegExp(query, "gi"),
    (match) => `<span class="highlight">${match}</span>`
  );
}

function displayResults(results) {
  searchResults.innerHTML = "";
  if (results.length === 0) {
    searchResults.innerHTML = "<p>No results found.</p>";
    return;
  }

  const ul = document.createElement("ul");
  results.forEach((page) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = page.permalink;
    a.innerHTML = highlightText(page.title, searchInput.value);
    li.appendChild(a);
    ul.appendChild(li);
  });
  searchResults.appendChild(ul);
}
