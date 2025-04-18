document.addEventListener("DOMContentLoaded", function() {
    const scrollToBottomButton = document.getElementById("scroll-to-bottom");
    const scrollToTopButton = document.getElementById("scroll-to-top");

    // Event listeners
    scrollToBottomButton.addEventListener("click", () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    scrollToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

function copyToClipboard(text, notificationMessage) {
    navigator.clipboard.writeText(text).then(() => {
        const notification = document.getElementById("notification");
        notification.textContent = notificationMessage;
        notification.style.display = "block";
        setTimeout(() => {
            notification.style.display = "none";
        }, 2000);
    });
}