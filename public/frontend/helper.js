export function bsTooltipInit() {
    [].slice
        .call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        .map(function(el) {
            new bootstrap.Tooltip(el);
        });
}

export function bsTooltipHide() {
    [].slice
        .call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        .map(function(el) {
            bootstrap.Tooltip.getInstance(el)?.dispose();
        });
}

export function bsModalError(title, body) {
    document.getElementById('errorModalTitle').innerText = title;
    document.getElementById('errorModalBody').innerText = body;
    new bootstrap.Modal(document.getElementById('errorModal')).show();
}

export function calculatePages(page, lastPage) {
    let pagesStart = 1;
    let pagesEnd = lastPage + 1;

    if (lastPage > 9) { // max 9 pages in paginator
        pagesStart = page > 5 ? page - 4 : 1;
        pagesEnd = page > 5 ? page + 5 : 10;
        if (pagesEnd > lastPage && lastPage > 9) {
            pagesEnd = lastPage + 1;
            pagesStart = pagesEnd - 9;
            if (pagesStart < 0) {
                pagesStart = 1;
            }
        }
    }

    let pages = [];
    for (let i = pagesStart; i < pagesEnd; ++i) {
        pages.push(i);
    }

    return pages;
}
