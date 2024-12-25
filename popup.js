document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const clipboardList = document.getElementById("clipboard-list");
    const clearButton = document.getElementById("clear");

    // Load clipboard data
    function loadClipboard() {
        chrome.storage.local.get({ clipboard: [] }, (data) => {
            const clipboard = data.clipboard;
            clipboardList.innerHTML = "";
            clipboard.forEach((entry) => {
                const li = document.createElement("li");
                li.textContent = `${entry.text} (saved at ${new Date(entry.timestamp).toLocaleString()})`;
                clipboardList.appendChild(li);
            });
        });
    }

    // Search clipboard
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        chrome.storage.local.get({ clipboard: [] }, (data) => {
            const clipboard = data.clipboard;
            clipboardList.innerHTML = "";
            clipboard
                .filter((entry) => entry.text.toLowerCase().includes(query))
                .forEach((entry) => {
                    const li = document.createElement("li");
                    li.textContent = `${entry.text} (saved at ${new Date(entry.timestamp).toLocaleString()})`;
                    clipboardList.appendChild(li);
                });
        });
    });

    // Clear clipboard
    clearButton.addEventListener("click", () => {
        chrome.storage.local.set({ clipboard: [] }, () => {
            loadClipboard();
            alert("Clipboard cleared!");
        });
    });

    // Initial load
    loadClipboard();
});