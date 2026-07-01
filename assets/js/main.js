let allData = [];

const categories = [
    "ALL", "ISO", "RETRO", "UNITED_STATES_OF_AMERICA", "AUSTRALIA", "BRAZIL", 
    "CANADA", "CHILE", "EU", "GREECE", "HONGKONG", "INDIA", "IRAN", "ISRAEAL", 
    "JAPAN", "KOREA", "MALAYSIA", "RUSSIA", "SAUDI_ARABIA", "THAILAND", 
    "TURKEY", "UNITED_KINGDOM", "VIETNAM", "AIRBUS", "MARINE", "TUNEL"
];

fetch('assets/data/katalog.json')
    .then(response => {
        if (!response.ok) throw new Error('JSON file could not be loaded');
        return response.json();
    })
    .then(data => {
        allData = data;

        renderKatalog(allData);
        
        createFilterMenu();
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
        const katalog = document.getElementById('katalog');
        if (katalog) katalog.innerHTML = '<div class="loading">Error loading data</div>';
    });

function createFilterMenu() {
    const menuContainer = document.getElementById('country-menu');
    if (!menuContainer) return;

    let menuHtml = '';
    categories.forEach(category => {
        const isActive = category === "ALL" ? "active" : "";
        const displayName = category.replace(/_/g, ' ');
        menuHtml += `<li class="menu-item ${isActive}" data-category="${category}">${displayName}</li>`;
    });
    menuContainer.innerHTML = menuHtml;

    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            document.querySelector('.menu-item.active')?.classList.remove('active');
            e.target.classList.add('active');

            const selectedCategory = e.target.getAttribute('data-category');

            if (selectedCategory === 'ALL') {
                renderKatalog(allData);
            } else {
                const filteredData = allData.filter(data => {
                    const titleMatch = data.Titel && data.Titel.toUpperCase().includes(selectedCategory);
                    const landMatch = data.Land && data.Land.toUpperCase().includes(selectedCategory);
                    return titleMatch || landMatch;
                });
                renderKatalog(filteredData);
            }
        });
    });
}

function renderKatalog(items) {
    const katalog = document.getElementById('katalog');
    if (!katalog) return;

    if (!Array.isArray(items) || items.length === 0) {
        katalog.innerHTML = '<div style="color: #666; padding: 20px 0;">No items found.</div>';
        return;
    }

    let html = '';

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let authorText = item.Author || '';
        let authorClass = '';

        if (!item.Author || item.Author === '-') {
            authorText = '';
            authorClass = 'unknown';
        }

        html += `
            <div class="card">
                <div class="card-image">
                    <img src="${item['@image']}" alt="${item.Titel || ''}">
                </div>
                <div class="card-content">
                    <div class="card-title">
                        ${item.Titel || ''}
                    </div>
                    <div class="card-author ${authorClass}">
                        ${authorText}
                    </div>
                </div>
            </div>
        `;
    }
    katalog.innerHTML = html;
}
