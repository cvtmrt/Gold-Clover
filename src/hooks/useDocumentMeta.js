import { useEffect } from 'react'

// SPA gezinmesinde sekme başlığı/açıklamasını güncel tutar.
// İlk boya + arama motorları için asıl meta sunucuda (server/seo.js) enjekte edilir;
// bu hook yalnızca istemci-tarafı geçişlerde başlığı senkronlar.
export default function useDocumentMeta(title, description) {
  useEffect(() => {
    if (title) document.title = title
    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }
  }, [title, description])
}
