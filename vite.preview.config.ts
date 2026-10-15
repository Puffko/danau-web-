import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Single-file snapshot for sharing a preview: everything inlined, hash routing.
// Not for production — the contact form has no /api/contact.php behind it.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  define: { 'import.meta.env.VITE_HASH_ROUTER': JSON.stringify('1') },
  build: {
    outDir: 'dist-preview',
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
  },
})
