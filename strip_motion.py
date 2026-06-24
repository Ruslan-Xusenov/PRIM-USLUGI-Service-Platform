import re

with open('src/app/HomeClient.js', 'r') as f:
    content = f.read()

# Remove imports
content = re.sub(r"import \{ LazyMotion, m, AnimatePresence \} from 'framer-motion';\n", "", content)
content = re.sub(r"import \{ loadFramerFeatures \} from '@/lib/framerFeatures';\n", "", content)

# Remove LazyMotion wrapper
content = re.sub(r"<LazyMotion features=\{loadFramerFeatures\} strict>", "", content)
content = re.sub(r"</LazyMotion>", "", content)

# Replace <m.tag with <tag
content = re.sub(r"<m\.([a-zA-Z0-9_]+)", r"<\1", content)
content = re.sub(r"</m\.([a-zA-Z0-9_]+)>", r"</\1>", content)

# Remove motion props. Be careful with multi-line props.
# We will use regex to remove variants={...}, initial={...}, animate={...}, whileInView={...}, viewport={...}, transition={...}, whileHover={...}
props_to_remove = ['variants', 'initial', 'animate', 'whileInView', 'viewport', 'transition', 'whileHover']
for prop in props_to_remove:
    # Regex to match prop={...} or prop="..."
    # This handles nested braces by matching up to the first '}' if it's simple, or we can just do a simpler approach.
    # Actually, simpler approach: replace prop={...} where ... contains no unescaped closing brace.
    # For nested braces like transition={{ delay: 0.1 }}, it's trickier.
    pass

# Let's just use string replacement for common ones since they are relatively standard in the file.
content = re.sub(r'\b(?:variants|initial|animate|whileInView|viewport|transition|whileHover|exit|custom)=\{.*?\}\}?', '', content, flags=re.DOTALL)
# Wait, the above regex is too greedy and might delete too much.
