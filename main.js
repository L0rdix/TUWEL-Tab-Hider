// ==UserScript==
// @name        TUWEL Tabs verstecken
// @namespace   Violentmonkey Scripts
// @match       https://tuwel.tuwien.ac.at/course/view.php*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.0
// @author      Amir Salman
// @description Verstecke TUWEL Tabs bei Bedarf
// ==/UserScript==

(function() {
    'use strict';

    const courseMatch = location.href.match(/id=(\d+)/);
    const courseId = courseMatch ? courseMatch[1] : 'default';
    const key = `hiddenTabs_${courseId}`;

    function saveHidden(hiddenSet) {
        GM_setValue(key, JSON.stringify(Array.from(hiddenSet)));
    }

    function loadHidden() {
        return new Set(JSON.parse(GM_getValue(key, '[]')));
    }

    function showAllTabs() {
        const hiddenSet = new Set();
        saveHidden(hiddenSet);
        document.querySelectorAll('li[id^="section-"]').forEach(li => li.style.display = '');
    }

    // Remove "Alles aufklappen"
    function removeAllesButton() {
        const allesLinks = document.querySelectorAll('.section-collapsemenu');
        allesLinks.forEach(link => {
            if (link.textContent.includes('aufklappen') || link.textContent.includes('einklappen')) {
                link.remove();
            }
        });
    }

    // 👁 Global button
    function addGlobalButton() {
        if (document.getElementById('global-show-all')) return;
        const h1 = document.querySelector('h1.h2');
        if (!h1) {
            return;
        }

        const btn = document.createElement('button');
        btn.id = 'global-show-all';
        btn.className = 'btn btn-outline-primary btn-sm ms-2 p-1';
        btn.innerHTML = '👁';
        btn.title = 'Alle Tabs anzeigen';
        btn.onclick = showAllTabs;

        const parent = h1.parentNode;
        parent.style.display = 'flex';
        parent.style.alignItems = 'center';
        parent.insertBefore(btn, h1.nextSibling);
    }

    function processSection(section) {
        if (section.dataset.btnProcessed) return;
        section.dataset.btnProcessed = 'true';

        const header = section.querySelector('.course-section-header');
        if (!header || section.style.display === 'none') return;

        // Remove old button
        header.querySelector('a[data-hide-tab]')?.remove();

        const btn = document.createElement('a');
        btn.dataset.hideTab = 'true';
        btn.className = 'btn btn-secondary btn-sm p-1';
        btn.href = '#';
        btn.role = 'button';
        btn.innerHTML = '🕶️';
        btn.title = 'Tab verstecken';
        btn.style.cssText = `
            position:absolute !important;
            right:8px !important;
            top:50% !important;
            transform:translateY(-50%) !important;
            z-index:20 !important;
            font-size:16px !important;
            background:transparent !important;
            border:none !important;
        `;

        header.style.position = 'relative';
        header.appendChild(btn);

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const hiddenSet = loadHidden();
            hiddenSet.add(section.id);
            saveHidden(hiddenSet);
            section.style.display = 'none';
        };
    }

    function init() {
        removeAllesButton();
        addGlobalButton();

        document.querySelectorAll('li[id^="section-"].section').forEach(processSection);

        // Apply hidden state
        loadHidden().forEach(id => {
            const li = document.getElementById(id);
            if (li) {
                li.style.display = 'none';
            }
        });
    }

    // Run multiple times for dynamic content
    let attempts = 0;
    const runner = () => {
        attempts++;
        init();
        if (attempts < 10) setTimeout(runner, 800);
    };

    runner();

    new MutationObserver(init).observe(document.body, {childList:true, subtree:true});

    console.log(`Course ID: ${courseId}, Storage: ${key}`);
})();
