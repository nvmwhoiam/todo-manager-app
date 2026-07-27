export function setClosedToOpen(selector) {
    if (!selector) return;
    selector.setAttribute("data-state", "open");
}

export function setClosingToClosed(selector) {
    if (!selector) return;
    selector.setAttribute("data-state", "closing");
    
    const handleAnimationEnd = function () {
        selector.setAttribute("data-state", "closed");
    };
    
    selector.addEventListener("animationend", handleAnimationEnd, { once: true });
}