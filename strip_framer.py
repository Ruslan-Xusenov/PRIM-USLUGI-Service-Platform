import re

with open('src/app/HomeClient.js', 'r') as f:
    content = f.read()

# Remove imports
content = re.sub(r"import \{ LazyMotion, m, AnimatePresence \} from 'framer-motion';\n", "", content)
content = re.sub(r"import \{ loadFramerFeatures \} from '@/lib/framerFeatures';\n", "", content)

# Remove wrappers
content = re.sub(r"<LazyMotion features=\{loadFramerFeatures\} strict>", "", content)
content = re.sub(r"</LazyMotion>", "", content)
content = re.sub(r"<AnimatePresence>", "", content)
content = re.sub(r"</AnimatePresence>", "", content)

# Replace <m.div with <div
content = re.sub(r"<m\.([a-zA-Z0-9]+)", r"<\1", content)
content = re.sub(r"</m\.([a-zA-Z0-9]+)>", r"</\1>", content)

# Remove variants, initial, whileInView, viewport, animate, transition, whileHover, exit, custom
# This regex matches prop={...} or prop="..."
content = re.sub(r'\b(?:variants|initial|whileInView|viewport|animate|transition|whileHover|exit|custom)=\{.*?\}\}?', '', content, flags=re.DOTALL)
# Wait, nested braces like transition={{ duration: 1 }} are handled by \}=\{.*?\}\}? but might be brittle.
# Let's use a simpler regex that matches { ... } up to the first closing } if not nested, but many are nested.
