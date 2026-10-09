const fs = require('fs');
const path = require('path');

const files = [
    'about.html',
    'contact.html',
    'home-2.html',
    'index.html',
    'loyalty.html',
    'menu.html',
    'our-chai.html',
    'tea-journal.html'
];

for (const filename of files) {
    const p = path.join(__dirname, filename);
    if (!fs.existsSync(p)) continue;
    
    let content = fs.readFileSync(p, 'utf-8');

    // Strategy: Replace ALL navbar links with a canonical "inactive" state first.
    // We can just rely on replacing classes.

    // 1. Desktop Primary Pages (About, Menu, etc.)
    // They look like: <a href="menu.html" class="text-[11px] font-bold tracking-[0.14em] uppercase ...">
    // Inactive: text-stone-700 dark:text-stone-200 hover:text-primary dark:hover:text-orange-400 transition-colors
    // Active: text-primary dark:text-orange-400 transition-colors
    
    // Reset all desktop primary to inactive (they might currently be active or inactive)
    content = content.replace(
        /(<a href="[^"]+"\s+class="text-\[11px\] font-bold tracking-\[0\.14em\] uppercase )([^"]*)(">)/g,
        (match, p1, p2, p3) => {
            return p1 + "text-stone-700 dark:text-stone-200 hover:text-primary dark:hover:text-orange-400 transition-colors" + p3;
        }
    );

    // 2. Desktop Home Dropdown Button
    // Inactive: text-stone-700 dark:text-stone-200 hover:text-primary dark:hover:text-orange-400
    // Active: text-primary dark:text-orange-400
    content = content.replace(
        /(<button type="button" class="flex items-center gap-1\.5 text-\[11px\] font-bold tracking-\[0\.14em\] uppercase )([^"]*)(py-6 focus:outline-none">)/g,
        (match, p1, p2, p3) => {
            return p1 + "text-stone-700 dark:text-stone-200 hover:text-primary dark:hover:text-orange-400 transition-colors " + p3;
        }
    );

    // 3. Desktop Dropdown Items (home1, home2)
    // Inactive: text-stone-700 dark:text-stone-300 hover:bg-primaryLight dark:hover:bg-stone-800/60 hover:text-primary transition-colors
    // Active: text-primary dark:text-orange-400 bg-primaryLight/60 dark:bg-stone-800/40 transition-colors
    content = content.replace(
        /(<a href="[^"]+"\s+class="block px-4 py-2\.5 text-\[11px\] font-bold tracking-\[0\.14em\] uppercase )([^"]*)(">home[12]<\/a>)/g,
        (match, p1, p2, p3) => {
            return p1 + "text-stone-700 dark:text-stone-300 hover:bg-primaryLight dark:hover:bg-stone-800/60 hover:text-primary transition-colors" + p3;
        }
    );

    // 4. Mobile Links (About, Menu, etc.)
    // Active: text-primary dark:text-orange-400
    // Inactive: text-stone-800 dark:text-stone-100 hover:text-primary
    content = content.replace(
        /(<a href="[^"]+"\s+class="text-sm font-bold uppercase tracking-\[0\.14em\] )([^"]*)(">)(?!home[12])/g,
        (match, p1, p2, p3) => {
            return p1 + "text-stone-800 dark:text-stone-100 hover:text-primary" + p3;
        }
    );

    // 5. Mobile Dropdown Items (home1, home2)
    // Active: text-primary dark:text-orange-400
    // Inactive: text-stone-700 dark:text-stone-300 hover:text-primary
    content = content.replace(
        /(<a href="[^"]+"\s+class="text-sm font-bold uppercase tracking-\[0\.14em\] )([^"]*)(">home[12]<\/a>)/g,
        (match, p1, p2, p3) => {
            return p1 + "text-stone-700 dark:text-stone-300 hover:text-primary" + p3;
        }
    );

    // Now set the ACTIVE state based on the current filename
    if (['index.html', 'home-2.html'].includes(filename)) {
        // Desktop Home Dropdown Button -> active
        content = content.replace(
            /(<button type="button" class="flex items-center gap-1\.5 text-\[11px\] font-bold tracking-\[0\.14em\] uppercase )([^"]*)(py-6 focus:outline-none">)/g,
            (match, p1, p2, p3) => {
                return p1 + "text-primary dark:text-orange-400 " + p3;
            }
        );
        // Desktop Dropdown Item -> active
        content = content.replace(
            new RegExp('(<a href="' + filename + '"\\s+class="block px-4 py-2\\.5 text-\\[11px\\] font-bold tracking-\\[0\\.14em\\] uppercase )([^"]*)(">home[12]</a>)'),
            (match, p1, p2, p3) => {
                return p1 + "text-primary dark:text-orange-400 bg-primaryLight/60 dark:bg-stone-800/40 transition-colors" + p3;
            }
        );
        // Mobile Dropdown Item -> active
        content = content.replace(
            new RegExp('(<a href="' + filename + '"\\s+class="text-sm font-bold uppercase tracking-\\[0\\.14em\\] )([^"]*)(">home[12]</a>)'),
            (match, p1, p2, p3) => {
                return p1 + "text-primary dark:text-orange-400" + p3;
            }
        );
    } else {
        // Desktop Primary Page -> active
        content = content.replace(
            new RegExp('(<a href="' + filename + '"\\s+class="text-\\[11px\\] font-bold tracking-\\[0\\.14em\\] uppercase )([^"]*)(">)'),
            (match, p1, p2, p3) => {
                return p1 + "text-primary dark:text-orange-400 transition-colors" + p3;
            }
        );
        // Mobile Primary Page -> active
        content = content.replace(
            new RegExp('(<a href="' + filename + '"\\s+class="text-sm font-bold uppercase tracking-\\[0\\.14em\\] )([^"]*)(">)'),
            (match, p1, p2, p3) => {
                return p1 + "text-primary dark:text-orange-400" + p3;
            }
        );
    }

    fs.writeFileSync(p, content, 'utf-8');
}

console.log('Fixed all files.');
