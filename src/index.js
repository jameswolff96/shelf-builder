function addShelfBefore(button) {
    const template = document.getElementById('shelfTemplate');
    const clone = template.content.cloneNode(true);
    const insertBtn = button.closest('.insert-shelf-button');
    const container = document.getElementById('shelfContainer');
    container.insertBefore(clone, insertBtn);
    updateSpotNumbers();
    autoSaveState();
}

function addShelfToEnd() {
    const template = document.getElementById('shelfTemplate');
    const clone = template.content.cloneNode(true);
    document.getElementById('shelfContainer').appendChild(clone);
    updateSpotNumbers();
    autoSaveState();
}

function removeShelf(button) {
    const shelf = button.closest('.shelf');
    const insertBtn = shelf.previousElementSibling;
    shelf.remove();
    if (insertBtn && insertBtn.classList.contains('insert-shelf-button')) {
        insertBtn.remove();
    }
    updateSpotNumbers();
    autoSaveState();
}

function addSpot(button) {
    const template = document.getElementById('spotTemplate');
    const clone = template.content.cloneNode(true);
    const container = button.parentElement.querySelector('.spot-container');
    container.appendChild(clone);

    updateSpotNumbers();
    applySettings();
    const select = container.lastElementChild.querySelector('.spot-size');
    if (select) updateSpotColor(select);
    autoSaveState();
}

async function exportJSON() {
  const aisle = document.getElementById('aisleInput').value;
  const bin = document.getElementById('binInput').value;

  const data = {
    version: 2,
    aisle, bin,
    theme: document.documentElement.getAttribute('data-theme') || 'light',
    spotSizeConfig,
    shelfWidthFt: parseFloat(document.getElementById('shelfWidthInput').value || 4),
    shelves: Array.from(document.querySelectorAll('.shelf')).map(shelf => ({
      name: shelf.querySelector('.shelf-name')?.value || '',
      spotsPerRow: shelf.querySelector('.spots-per-row')?.value || 6,
      spots: Array.from(shelf.querySelectorAll('.spot-wrapper')).map(wrapper => ({
        item: wrapper.querySelector('.spot-item')?.innerText || '',
        size: parseInt(wrapper.querySelector('.spot-size')?.value || 12)
      }))
    }))
  };

  const jsonString = JSON.stringify(data, null, 2);

  // Modern browser support
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: `bin-${aisle}-${bin}.json`,
        types: [{
          description: 'JSON file',
          accept: { 'application/json': ['.json'] }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(jsonString);
      await writable.close();
    } catch (err) {
      console.error('Export canceled or failed:', err);
    }
  } else {
    // Fallback for older browsers
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bin-${aisle}-${bin}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}


function importJSON(event, fromString = null) {
    const loadData = (json) => {
        const data = JSON.parse(json);

        // Check version compatibility
        if (typeof data.version !== 'number') {
            if (!confirm("This file has no version info. Attempt to load anyway?")) return;
        } else if (data.version !== 2) {
            if (!confirm(`This file was saved with a different version (${data.version}). Attempt to load anyway?`)) return;
        }

        document.getElementById('aisleInput').value = data.aisle;
        document.getElementById('binInput').value = data.bin;

        // Restore theme
        document.documentElement.setAttribute('data-theme', data.theme || 'light');
        const icon = document.getElementById('themeIcon');
        if (icon) {
            icon.classList.remove('fa-sun', 'fa-moon');
            icon.classList.add(data.theme === 'dark' ? 'fa-sun' : 'fa-moon');
        }

        // Restore spot size config
        if (Array.isArray(data.spotSizeConfig)) {
            spotSizeConfig = data.spotSizeConfig;
            renderSpotSizeOptions();
            renderSpotSizeLegend();
        }

        if (data.shelfWidthFt) {
            document.getElementById('shelfWidthInput').value = data.shelfWidthFt;
            updateShelfWidthDisplay();
        }

        const container = document.getElementById('shelfContainer');
        container.innerHTML = '';

        data.shelves.forEach(shelf => {
            const shelfNode = document.getElementById('shelfTemplate').content.cloneNode(true);
            shelfNode.querySelector('.shelf-name').value = shelf.name;
            if (shelf.spotsPerRow === undefined) {
                shelf.spotsPerRow = 6;
            }
            shelfNode.querySelector('.spots-per-row').value = shelf.spotsPerRow;
            const spotContainer = shelfNode.querySelector('.spot-container');

            shelf.spots.forEach(spot => {
                const spotNode = document.getElementById('spotTemplate').content.cloneNode(true);
                spotNode.querySelector('.spot-item').innerText = spot.item;
                const sizeSelect = spotNode.querySelector('.spot-size');
                sizeSelect.innerHTML = '';
                spotSizeConfig.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.size;
                    if (opt.size == spot.size) option.selected = true;
                    option.textContent = `${opt.size} in`;
                    sizeSelect.appendChild(option);
                });
                sizeSelect.value = spot.size;
                updateSpotColor(sizeSelect);
                spotContainer.appendChild(spotNode);
            });
            
            container.appendChild(shelfNode);
        });

        document.querySelectorAll('.spot-container').forEach(container => {
            observer.observe(container, { childList: true, subtree: false });
        });

        updateSpotNumbers();
        updateAllSpotSizeDropdowns();
        renderSpotSizeLegend();
        document.querySelectorAll('.spot-per-row').forEach(input => {
            updateSpotBasis(input);
        });
    };

    if (fromString) {
        loadData(fromString);
    } else {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => loadData(e.target.result);
        reader.readAsText(file);
    }
}

function autoSaveState() {
    const exportData = {
        version: 1,
        aisle: document.getElementById('aisleInput').value,
        bin: document.getElementById('binInput').value,
        theme: document.documentElement.getAttribute('data-theme') || 'light',
        spotSizeConfig,
        shelfWidthFt: parseFloat(document.getElementById('shelfWidthInput').value || 4),
        shelves: Array.from(document.querySelectorAll('.shelf')).map(shelf => ({
            name: shelf.querySelector('.shelf-name')?.value || '',
            spotsPerRow: shelf.querySelector('.spots-per-shelf')?.value || 6,
            spots: Array.from(shelf.querySelectorAll('.spot-wrapper')).map(wrapper => ({
                item: wrapper.querySelector('.spot-item')?.innerText || '',
                size: parseInt(wrapper.querySelector('.spot-size')?.value || 12)
            }))
        }))
    };
    localStorage.setItem('warehouseLabelEditorState', JSON.stringify(exportData));
}

function onDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.outerHTML);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
}

function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function onDrop(e) {
    e.preventDefault();
    const dropTarget = e.target.closest('.spot-wrapper');
    const draggingElem = document.querySelector('.dragging');
    if (!dropTarget || dropTarget === draggingElem) return;
    if (draggingElem) draggingElem.remove();
    const html = e.dataTransfer.getData('text/plain');
    e.target.closest('.spot-wrapper').insertAdjacentHTML('beforebegin', html);
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    updateSpotNumbers();
}

function updateSpotNumbers() {
    document.querySelectorAll('.spot-container').forEach(container => {
        container.querySelectorAll('.spot-wrapper').forEach((spot, index) => {
            const numberSpan = spot.querySelector('.spot-number');
            if (numberSpan) numberSpan.textContent = `${String(index).padStart(2, '0')}:`;
        });
    });
}

const observer = new MutationObserver(updateSpotNumbers);
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.spot-container').forEach(container => {
        observer.observe(container, { childList: true, subtree: false });
    });
    updateSpotNumbers();
});

function updateSpotColor(select) {
    const wrapper = select.closest('.spot-wrapper');
    const size = parseInt(select.value);

    const config = spotSizeConfig.find(opt => opt.size === size);
    if (config) {
        wrapper.style.backgroundColor = config.color;
    } else {
        wrapper.style.backgroundColor = '';
    }
    autoSaveState();
}

function updateSpotBasis(input) {
    const shelf = input.closest('.shelf');
    const spotsPerRow = parseInt(input.value) + 0.5;

    if (spotsPerRow < 1) {
        spotsPerRow = 6.5;
    }

    const basis = 100 / spotsPerRow;
    
    shelf.querySelectorAll('.spot-container > *').forEach(child => {
        child.style.flexBasis = `${basis}%`;
    });
    autoSaveState();
}

let defaultSpotSizeConfig = [
    { size: 12, color: '#e0f7fa' },
    { size: 18, color: '#ffe082' },
    { size: 24, color: '#ffcdd2' }
];

let spotSizeConfig = [...defaultSpotSizeConfig];

function renderSpotSizeOptions() {
    const container = document.getElementById('spotSizeOptions');
    container.innerHTML = '';

    spotSizeConfig.forEach((option, index) => {
        const row = document.createElement('div');
        row.innerHTML = `
        <input type="number" min="1" value="${option.size}" onchange="updateSpotSizeValue(${index}, this.value)" style="width:60px"/> in
        <input type="color" value="${option.color}" onchange="updateSpotSizeColor(${index}, this.value)"/>
        <button onclick="removeSpotSizeOption(${index})">✕</button>
      `;
        container.appendChild(row);
    });
}

function renderSpotSizeLegend() {
    const container = document.getElementById('spotSizeLegend');
    container.innerHTML = '<strong>Spot Size Legend:</strong><br>';
    spotSizeConfig.forEach(opt => {
        const swatch = document.createElement('span');
        swatch.style.display = 'inline-block';
        swatch.style.width = '1em';
        swatch.style.height = '1em';
        swatch.style.backgroundColor = opt.color;
        swatch.style.border = '1px solid #000';
        swatch.style.verticalAlign = 'middle';

        const size = document.createElement('span');
        size.style.marginLeft = '2px';
        size.style.marginRight = '4px';
        size.style.verticalAlign = 'middle';
        size.innerHTML = ` ${opt.size} in `

        container.appendChild(swatch);
        container.appendChild(size);
    });
}

function updateSpotSizeValue(index, value) {
    const newSize = parseInt(value);
    spotSizeConfig[index].size = newSize;
}


function updateSpotSizeColor(index, value) {
    spotSizeConfig[index].color = value;
}

function removeSpotSizeOption(index) {
    spotSizeConfig.splice(index, 1);
    renderSpotSizeOptions();
}

function getRandomLightHex() {
    const r = Math.floor(180 + Math.random() * 75);
    const g = Math.floor(180 + Math.random() * 75);
    const b = Math.floor(180 + Math.random() * 75);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function addSpotSizeOption() {
    spotSizeConfig.push({ size: 1, color: getRandomLightHex() });
    renderSpotSizeOptions();
}

function openSettings() {
    renderSpotSizeOptions();
    document.getElementById('settingsModal').classList.remove('hidden');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
}

function updateShelfWidthDisplay() {
    const shelfWidthFt = parseFloat(document.getElementById('shelfWidthInput').value || 4);
    const display = document.getElementById('physicalShelfWidthDisplay');
    if (display) {
        display.textContent = `Shelf Width: ${shelfWidthFt.toFixed(1)} ft`;
    }
}

function applySettings() {
    const warning = document.getElementById('spotSizeWarning');
    warning.style.display = 'none';

    const sizes = spotSizeConfig.map(opt => opt.size);
    const hasDuplicates = sizes.some((size, idx) => sizes.indexOf(size) !== idx);
    const hasInvalid = sizes.some(size => !Number.isInteger(size) || size <= 0);

    if (hasInvalid) {
        warning.textContent = 'All spot sizes must be positive integers.';
        warning.style.display = 'block';
        return;
    }

    if (hasDuplicates) {
        warning.textContent = 'Spot sizes must be unique.';
        warning.style.display = 'block';
        return;
    }

    updateAllSpotSizeDropdowns();
    updateShelfWidthDisplay();
    renderSpotSizeLegend();
    closeSettings();
    updateSpotNumbers();
    autoSaveState();
}

function updateAllSpotSizeDropdowns() {
    spotSizeConfig.sort((a, b) => a.size - b.size);

    document.querySelectorAll('.spot-size').forEach(select => {
        const current = select.value;
        select.innerHTML = '';
        spotSizeConfig.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.size;
            option.textContent = `${opt.size} in`;
            if (opt.size == current) option.selected = true;
            select.appendChild(option);
        });
        updateSpotColor(select);
    });
}

function toggleDarkMode() {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    const isDark = html.getAttribute('data-theme') === 'dark';

    if (isDark) {
        html.setAttribute('data-theme', 'light');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        html.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    autoSaveState();
}

function resetAppState() {
    if (!confirm('This will clear all saved data and reset the editor to defaults. Continue?')) return;

    localStorage.removeItem('warehouseLabelEditorState');

    // Reset theme
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('themeIcon')?.classList.replace('fa-sun', 'fa-moon');

    // Reset aisle/bin
    document.getElementById('aisleInput').value = 'A';
    document.getElementById('binInput').value = '1';

    // Clear and reset shelves
    document.getElementById('shelfContainer').innerHTML = '';

    // Reset shelf width
    document.getElementById('shelfWidthInput').value = 4;
    updateShelfWidthDisplay();

    // Reset spot size config
    spotSizeConfig = [...defaultSpotSizeConfig];
    renderSpotSizeOptions();
    renderSpotSizeLegend();

    // Clear any warnings
    document.getElementById('spotSizeWarning').style.display = 'none';

    // Save the reset state
    autoSaveState();
}
document.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeIcon')?.classList.replace('fa-moon', 'fa-sun');
    }

    const saved = localStorage.getItem('warehouseLabelEditorState');
    if (saved) {
        importJSON(null, saved);
    }
    applySettings();
});
