// Background script to capture clipboard on demand
chrome.runtime.onInstalled.addListener(() => {
    console.log("Cliphoard extension installed");

    async function captureClipboard() {
        try {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length === 0) return;
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tabs[0].id },
                        func: () => navigator.clipboard.readText(),
                    },
                    (results) => {
                        if (chrome.runtime.lastError || !results || !results[0].result) {
                            console.error("Failed to read clipboard:", chrome.runtime.lastError);
                            return;
                        }
                        const text = results[0].result;
                        chrome.storage.local.get({ clipboard: [] }, (data) => {
                            const clipboard = data.clipboard;
                            if (!clipboard.some((entry) => entry.text === text)) {
                                clipboard.unshift({ text, timestamp: new Date().toISOString() });
                                chrome.storage.local.set({ clipboard });
                                console.log("Clipboard text saved:", text);
                            }
                        });
                    }
                );
            });
        } catch (err) {
            console.error("Failed to read clipboard:", err);
        }
    }

    // Context menu to trigger clipboard capture
    chrome.contextMenus.create({
        id: "captureClipboard",
        title: "Capture Clipboard",
        contexts: ["all"]
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === "captureClipboard") {
            captureClipboard();
        }
    });

    // Set up an alarm to periodically check the clipboard
    chrome.alarms.create("checkClipboard", { periodInMinutes: 1 });

    chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === "checkClipboard") {
            captureClipboard();
        }
    });
});