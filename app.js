class TraitSelector {
    constructor() {
        this.selectedTraits = new Set();
        this.init();
    }

    async init() {
        await this.loadTraits();
        this.setupSearch();
    }

    async loadTraits() {
        try {
            const response = await fetch('traits-data.json');
            this.traitsData = await response.json();
            this.renderTraits();
        } catch (error) {
            console.error('Error cargando los datos:', error);
        }
    }

    renderTraits() {
        this.renderCategory('virtudes', 'Virtudes');
        this.renderCategory('defectos', 'Defectos');
    }

    renderCategory(type, title) {
        const container = document.createElement('div');
        container.innerHTML = `<h2>${title}</h2>`;
        
        Object.entries(this.traitsData[type]).forEach(([category, subcategories]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            
            const header = document.createElement('div');
            header.className = 'category-header';
            header.innerHTML = `
                ${category}
                <i class="fas fa-chevron-down"></i>
            `;
            
            const content = document.createElement('div');
            content.style.display = 'none';
            
            Object.entries(subcategories).forEach(([subcategory, traits]) => {
                traits.forEach(trait => {
                    const traitDiv = document.createElement('div');
                    traitDiv.className = 'trait-item';
                    traitDiv.textContent = trait;
                    traitDiv.onclick = () => this.toggleTrait(trait, type);
                    content.appendChild(traitDiv);
                });
            });

            header.onclick = () => {
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
                header.querySelector('i').classList.toggle('fa-chevron-up');
            };

            categoryDiv.appendChild(header);
            categoryDiv.appendChild(content);
            container.appendChild(categoryDiv);
        });

        document.getElementById(`${type}Container`).appendChild(container);
    }

    toggleTrait(trait, type) {
        const id = `${type}-${trait}`;
        this.selectedTraits.has(id) ? this.selectedTraits.delete(id) : this.selectedTraits.add(id);
        this.updateSelected();
    }

    updateSelected() {
        const container = document.getElementById('selectedItems');
        container.innerHTML = '';
        
        this.selectedTraits.forEach(id => {
            const [type, trait] = id.split('-');
            const div = document.createElement('div');
            div.className = `selected-item ${type === 'defectos' ? 'defecto' : ''}`; // Agregar clase según el tipo
            div.innerHTML = `
                <span>${trait} <small>(${type})</small></span>
                <button onclick="selector.removeTrait('${id}')">✕</button>
            `;
            container.appendChild(div);
        });
    }
    
    removeTrait(id) {
        this.selectedTraits.delete(id);
        this.updateSelected();
    }

    setupSearch() {
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.trait-item').forEach(item => {
                item.style.display = item.textContent.toLowerCase().includes(term) ? 'block' : 'none';
            });
        });
    }
}

const selector = new TraitSelector();