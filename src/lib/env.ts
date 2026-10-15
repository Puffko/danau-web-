/** True in the single-file preview build (vite.preview.config.ts): no server, no real form endpoint. */
export const isPreview = import.meta.env.VITE_PREVIEW === '1'
