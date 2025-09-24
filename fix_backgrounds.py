import re

# Read the file
with open('rutgers.html', 'r') as f:
    content = f.read()

# Update the position group styling to be more prominent and override white backgrounds
old_pattern = r'        /\* Position Group Styling - Alternating Background Colors \*/.*?        \.position-group-db \{\s*background: rgba\(255, 182, 193, 0\.08\) !important;\s*\}'

new_css = '''        /* Position Group Styling - Alternating Background Colors */
        .position-group-wr {
            background: rgba(255, 107, 107, 0.15) !important;
        }

        .position-group-te {
            background: rgba(78, 205, 196, 0.08) !important;
        }

        .position-group-rb {
            background: rgba(69, 183, 209, 0.15) !important;
        }

        .position-group-ol {
            background: rgba(150, 206, 180, 0.08) !important;
        }

        .position-group-dl {
            background: rgba(255, 234, 167, 0.15) !important;
        }

        .position-group-lb {
            background: rgba(221, 160, 221, 0.08) !important;
        }

        .position-group-db {
            background: rgba(255, 182, 193, 0.15) !important;
        }'''

# Replace the old CSS with the new one
content = re.sub(old_pattern, new_css, content, flags=re.DOTALL)

# Write the updated content back
with open('rutgers.html', 'w') as f:
    f.write(content)

print('Updated position group styling with more prominent background colors')
