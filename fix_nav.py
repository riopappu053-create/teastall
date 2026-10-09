import os
import re

files = [
    'about.html',
    'contact.html',
    'home-2.html',
    'index.html',
    'loyalty.html',
    'menu.html',
    'our-chai.html',
    'tea-journal.html'
]

# We want to identify the current page being parsed
for filename in files:
    if not os.path.exists(filename):
        continue
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # We can parse out the desktop links using regex.
    # The links look like: <a href="page.html" class="...">Text</a>
    # We will reset all links to inactive, and then set the current page's link to active.

    # 1. Desktop Primary Pages (reset all to inactive)
    # The regex targets the known active or inactive classes for these links
    content = re.sub(
        r'(<a href="[^"]+"\s+class="[^"]*text-\[11px\][^"]*)text-primary dark:text-orange-400([^"]*">)',
        r'\1text-stone-700 dark:text-stone-200 hover:text-primary dark:hover:text-orange-400\2',
        content
    )
    
    # Also remove duplicates if any got created
    content = content.replace(
        'text-stone-700 dark:text-stone-200 hover:text-primary dark:hover:text-orange-400 transition-colors transition-colors',
        'text-stone-700 dark:text-stone-200 hover:text-primary dark:hover:text-orange-400 transition-colors'
    )
    
    # 2. Desktop Home Dropdown Button
    # Reset to inactive (remove text-primary dark:text-orange-400 and add text-stone-700 ...)
    content = re.sub(
        r'(<button type="button" class="[^"]*)text-primary dark:text-orange-400(\s*py-6 focus:outline-none[^"]*">)',
        r'\1text-stone-700 dark:text-stone-200 hover:text-primary dark:hover:text-orange-400\2',
        content
    )
    # Just in case it was already inactive but with slightly different spacing:
    
    # 3. Desktop Dropdown Items (home1, home2)
    # Reset home1/home2 to inactive
    content = re.sub(
        r'(<a href="[^"]+"\s+class="[^"]*)text-primary dark:text-orange-400 bg-primaryLight/60 dark:bg-stone-800/40([^"]*">home[12]</a>)',
        r'\1text-stone-700 dark:text-stone-300 hover:bg-primaryLight dark:hover:bg-stone-800/60 hover:text-primary\2',
        content
    )

    # 4. Mobile Primary Pages
    content = re.sub(
        r'(<a href="[^"]+"\s+class="[^"]*text-sm font-bold uppercase tracking-\[0\.14em\] )text-primary dark:text-orange-400([^"]*">)(?!home[12])',
        r'\1text-stone-800 dark:text-stone-100 hover:text-primary\2',
        content
    )
    
    # 5. Mobile Dropdown Items (home1, home2)
    content = re.sub(
        r'(<a href="[^"]+"\s+class="[^"]*text-sm font-bold uppercase tracking-\[0\.14em\] )text-primary dark:text-orange-400([^"]*">home[12]</a>)',
        r'\1text-stone-700 dark:text-stone-300 hover:text-primary\2',
        content
    )
    
    # Now set the specific active link(s) for ilename

    # Desktop active replacement function for specific href
    def set_desktop_active(html, href):
        return re.sub(
            rf'(<a href="{href}"\s+class="[^"]*)text-stone-700 dark:text-stone-200 hover:text-primary dark:hover:text-orange-400([^"]*">)',
            r'\1text-primary dark:text-orange-400\2',
            html
        )
    
    # Mobile active replacement function for specific href
    def set_mobile_active(html, href):
        return re.sub(
            rf'(<a href="{href}"\s+class="[^"]*text-sm font-bold uppercase tracking-\[0\.14em\] )text-stone-800 dark:text-stone-100 hover:text-primary([^"]*">)',
            r'\1text-primary dark:text-orange-400\2',
            html
        )

    # If it's a primary page (about.html, contact.html, etc)
    if filename not in ['index.html', 'home-2.html']:
        content = set_desktop_active(content, filename)
        content = set_mobile_active(content, filename)
    else:
        # It's a home page, we need to highlight the Home button and the specific home item
        content = re.sub(
            r'(<button type="button" class="[^"]*)text-stone-700 dark:text-stone-200 hover:text-primary dark:hover:text-orange-400(\s*py-6 focus:outline-none[^"]*">)',
            r'\1text-primary dark:text-orange-400\2',
            content
        )
        # Desktop Dropdown Active
        content = re.sub(
            rf'(<a href="{filename}"\s+class="[^"]*)text-stone-700 dark:text-stone-300 hover:bg-primaryLight dark:hover:bg-stone-800/60 hover:text-primary([^"]*">home[12]</a>)',
            r'\1text-primary dark:text-orange-400 bg-primaryLight/60 dark:bg-stone-800/40\2',
            content
        )
        # Mobile Dropdown Active
        content = re.sub(
            rf'(<a href="{filename}"\s+class="[^"]*text-sm font-bold uppercase tracking-\[0\.14em\] )text-stone-700 dark:text-stone-300 hover:text-primary([^"]*">home[12]</a>)',
            r'\1text-primary dark:text-orange-400\2',
            content
        )
        
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done replacing active links.")
