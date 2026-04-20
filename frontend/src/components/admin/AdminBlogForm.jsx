import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { endpoints } from '../../lib/api'
import styles from '../../pages/AdminBlogNew.module.css'

const slugify = (str) =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const MAX_FILE_BYTES = 5 * 1024 * 1024

const EMPTY_INITIAL = {
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImageUrl: '',
  categoryId: '',
  tagIds: [],
}

/**
 * Shared form used by both "Create new post" and "Edit post" admin pages.
 *
 * It owns all the local form state, image upload flow, and tag/category
 * lookups. The parent page just provides:
 *
 *   - mode:          'create' | 'edit'        (controls submit-button copy)
 *   - initialPost:   pre-filled values        (empty object on create)
 *   - onSubmit:      async (payload) => post  (network call)
 *   - submitLabel:   custom action button copy (optional)
 *   - cancelTo:      route for the Cancel link
 *   - successMessage: function(post) returning the success copy
 *   - onSuccess:     callback(post) after successful save (for navigation)
 */
export default function AdminBlogForm({
  mode = 'create',
  initialPost = EMPTY_INITIAL,
  onSubmit,
  cancelTo = '/admin/blogs',
  successMessage,
  onSuccess,
}) {
  const fileInputRef = useRef(null)

  const [title, setTitle] = useState(initialPost.title || '')
  const [slug, setSlug] = useState(initialPost.slug || '')
  // On edit we treat the existing slug as user-set so it isn't overwritten
  // when the title is tweaked.
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [excerpt, setExcerpt] = useState(initialPost.excerpt || '')
  const [content, setContent] = useState(initialPost.content || '')

  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [coverUrl, setCoverUrl] = useState(initialPost.coverImageUrl || '')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const [allTags, setAllTags] = useState([])
  const [selectedTagIds, setSelectedTagIds] = useState(
    new Set(initialPost.tagIds || [])
  )
  const [tagInput, setTagInput] = useState('')
  const [tagsLoading, setTagsLoading] = useState(true)
  const [creatingTag, setCreatingTag] = useState(false)

  const [allCategories, setAllCategories] = useState([])
  const [categoryId, setCategoryId] = useState(initialPost.categoryId || '')

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // If the parent reloads with a different post (e.g. navigating between
  // edit pages without unmounting), re-sync the local state.
  useEffect(() => {
    setTitle(initialPost.title || '')
    setSlug(initialPost.slug || '')
    setSlugTouched(mode === 'edit')
    setExcerpt(initialPost.excerpt || '')
    setContent(initialPost.content || '')
    setCoverUrl(initialPost.coverImageUrl || '')
    setCoverFile(null)
    setSelectedTagIds(new Set(initialPost.tagIds || []))
    setCategoryId(initialPost.categoryId || '')
    setSubmitError('')
    setSuccessMsg('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPost.id])

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(title))
    }
  }, [title, slugTouched])

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(null)
      return
    }
    const objectUrl = URL.createObjectURL(coverFile)
    setCoverPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [coverFile])

  useEffect(() => {
    let mounted = true

    endpoints
      .listTags()
      .then((tags) => {
        if (mounted) setAllTags(tags || [])
      })
      .catch((err) => {
        console.warn('Failed to load tags', err)
      })
      .finally(() => mounted && setTagsLoading(false))

    endpoints
      .listCategories()
      .then((cats) => {
        if (mounted) setAllCategories(cats || [])
      })
      .catch((err) => {
        console.warn('Failed to load categories', err)
      })

    return () => {
      mounted = false
    }
  }, [])

  const selectedTags = useMemo(
    () => allTags.filter((t) => selectedTagIds.has(t.id)),
    [allTags, selectedTagIds]
  )

  const filteredTagSuggestions = useMemo(() => {
    const q = tagInput.trim().toLowerCase()
    if (!q) return []
    return allTags
      .filter(
        (t) =>
          !selectedTagIds.has(t.id) &&
          (t.name.toLowerCase().includes(q) || t.slug?.toLowerCase().includes(q))
      )
      .slice(0, 6)
  }, [allTags, selectedTagIds, tagInput])

  const tagAlreadyExists = useMemo(() => {
    const q = tagInput.trim().toLowerCase()
    if (!q) return false
    return allTags.some(
      (t) => t.name.toLowerCase() === q || t.slug?.toLowerCase() === q
    )
  }, [allTags, tagInput])

  const handleFilePick = (file) => {
    setUploadError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.')
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setUploadError('Image must be under 5MB.')
      return
    }
    setCoverFile(file)
    setCoverUrl('')
  }

  const handleUpload = async () => {
    if (!coverFile) return
    setUploading(true)
    setUploadError('')
    try {
      const { publicUrl } = await endpoints.uploadThumbnail(coverFile)
      setCoverUrl(publicUrl)
    } catch (err) {
      setUploadError(err?.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleClearImage = async () => {
    // Only delete from storage if this image was uploaded *during this session*.
    // The original cover (loaded from initialPost) shouldn't be eagerly removed
    // from storage just because the user clicked "Remove" — they might cancel.
    // The backend's update flow handles deletion when a new URL replaces it.
    const isFreshUpload = coverUrl && coverUrl !== initialPost.coverImageUrl
    if (isFreshUpload) {
      try {
        await endpoints.deleteThumbnail(coverUrl)
      } catch (err) {
        console.warn('Failed to delete uploaded image', err)
      }
    }
    setCoverFile(null)
    setCoverUrl('')
    setUploadError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const toggleTag = (id) => {
    setSelectedTagIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleCreateTag = async () => {
    const name = tagInput.trim()
    if (!name) return
    if (tagAlreadyExists) {
      const existing = allTags.find(
        (t) =>
          t.name.toLowerCase() === name.toLowerCase() ||
          t.slug?.toLowerCase() === name.toLowerCase()
      )
      if (existing) {
        toggleTag(existing.id)
        setTagInput('')
      }
      return
    }

    setCreatingTag(true)
    try {
      const created = await endpoints.createTag({
        name,
        slug: slugify(name),
      })
      setAllTags((prev) => [...prev, created])
      setSelectedTagIds((prev) => new Set(prev).add(created.id))
      setTagInput('')
    } catch (err) {
      setSubmitError(err?.message || 'Failed to create tag.')
    } finally {
      setCreatingTag(false)
    }
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleCreateTag()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSuccessMsg('')

    if (!title.trim()) return setSubmitError('Title is required.')
    if (!slug.trim()) return setSubmitError('Slug is required.')
    if (!content.trim()) return setSubmitError('Content is required.')

    let finalCoverUrl = coverUrl
    if (coverFile && !coverUrl) {
      try {
        setUploading(true)
        const { publicUrl } = await endpoints.uploadThumbnail(coverFile)
        finalCoverUrl = publicUrl
        setCoverUrl(publicUrl)
      } catch (err) {
        setUploading(false)
        return setSubmitError(err?.message || 'Image upload failed.')
      } finally {
        setUploading(false)
      }
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || undefined,
      content,
      coverImageUrl: finalCoverUrl || undefined,
      categoryId: categoryId || undefined,
      tagIds: Array.from(selectedTagIds),
    }

    setSubmitting(true)
    try {
      const result = await onSubmit(payload)
      setSuccessMsg(
        successMessage
          ? successMessage(result)
          : `Blog “${result?.title || title}” saved successfully.`
      )
      if (onSuccess) {
        // Give the user a moment to see the success message before navigating.
        setTimeout(() => onSuccess(result), 900)
      }
    } catch (err) {
      setSubmitError(err?.message || 'Failed to save post.')
    } finally {
      setSubmitting(false)
    }
  }

  const submitLabel = submitting
    ? mode === 'edit'
      ? 'Saving…'
      : 'Publishing…'
    : mode === 'edit'
      ? 'Save Changes'
      : 'Publish Post'

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="title">
                Title <span className={styles.required}>*</span>
              </label>
              <input
                id="title"
                type="text"
                className={styles.input}
                placeholder="A catchy headline that drives clicks"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="slug">
                URL Slug <span className={styles.required}>*</span>
              </label>
              <div className={styles.slugWrap}>
                <span className={styles.slugPrefix}>/blog/</span>
                <input
                  id="slug"
                  type="text"
                  className={`${styles.input} ${styles.slugInput}`}
                  placeholder="auto-generated-from-title"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setSlug(slugify(e.target.value))
                  }}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="excerpt">
                Excerpt
              </label>
              <input
                id="excerpt"
                type="text"
                className={styles.input}
                placeholder="Short summary that appears in listings"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="content">
                Content <span className={styles.required}>*</span>
              </label>
              <textarea
                id="content"
                className={styles.textarea}
                placeholder={
                  '## Major section heading\n' +
                  'Your intro paragraph goes here.\n\n' +
                  '### Sub-heading\n' +
                  'More detail here.\n\n' +
                  '- Bullet one\n- Bullet two\n\n' +
                  '**Bold text**, *italic*, and [links](https://example.com) work too.'
                }
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <div className={styles.hint}>
                ~ {Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200))} min
                read · {content.split(/\s+/).filter(Boolean).length} words
              </div>
              <div className={styles.hint} style={{ textAlign: 'left', marginTop: 4 }}>
                Tip: start a line with <code>##</code> for a section heading,
                <code> ###</code> for a sub-heading, <code>-</code> for bullets,
                or <code>&gt;</code> for a quote. Short stand-alone lines are
                auto-promoted to headings.
              </div>
            </div>
          </div>
        </div>

        <aside className={styles.sideCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Cover image</h3>

            {!coverPreview && !coverUrl ? (
              <label className={styles.dropZone}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className={styles.hiddenInput}
                  onChange={(e) => handleFilePick(e.target.files?.[0])}
                />
                <div className={styles.dropIcon} aria-hidden="true">+</div>
                <div className={styles.dropTitle}>Click to choose an image</div>
                <div className={styles.dropHint}>PNG, JPG up to 5 MB</div>
              </label>
            ) : (
              <div className={styles.previewWrap}>
                <img
                  src={coverUrl || coverPreview}
                  alt="Cover preview"
                  className={styles.previewImg}
                />
                <div className={styles.previewActions}>
                  {coverFile && !coverUrl && (
                    <button
                      type="button"
                      className={styles.uploadBtn}
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading…' : 'Upload to storage'}
                    </button>
                  )}
                  {coverUrl && (
                    <span className={styles.uploadedBadge}>Uploaded ✓</span>
                  )}
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={handleClearImage}
                    disabled={uploading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {uploadError && <div className={styles.alertError}>{uploadError}</div>}
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Tags</h3>

            {selectedTags.length > 0 && (
              <div className={styles.chipRow}>
                {selectedTags.map((t) => (
                  <span key={t.id} className={styles.chipSelected}>
                    {t.name}
                    <button
                      type="button"
                      className={styles.chipRemove}
                      onClick={() => toggleTag(t.id)}
                      aria-label={`Remove tag ${t.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className={styles.tagInputRow}>
              <input
                type="text"
                className={styles.input}
                placeholder="Add a tag (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <button
                type="button"
                className={styles.tagAddBtn}
                onClick={handleCreateTag}
                disabled={!tagInput.trim() || creatingTag}
              >
                {creatingTag ? '…' : '+ Add'}
              </button>
            </div>

            {filteredTagSuggestions.length > 0 && (
              <div className={styles.suggestRow}>
                {filteredTagSuggestions.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    className={styles.chip}
                    onClick={() => {
                      toggleTag(t.id)
                      setTagInput('')
                    }}
                  >
                    + {t.name}
                  </button>
                ))}
              </div>
            )}

            {!tagsLoading && allTags.length > 0 && !tagInput && (
              <>
                <div className={styles.subLabel}>Existing tags</div>
                <div className={styles.chipRow}>
                  {allTags
                    .filter((t) => !selectedTagIds.has(t.id))
                    .slice(0, 12)
                    .map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        className={styles.chip}
                        onClick={() => toggleTag(t.id)}
                      >
                        {t.name}
                      </button>
                    ))}
                </div>
              </>
            )}
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Publish settings</h3>

            {allCategories.length > 0 && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  className={styles.input}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">— None —</option>
                  {allCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </aside>
      </div>

      {submitError && <div className={styles.alertError}>{submitError}</div>}
      {successMsg && <div className={styles.alertSuccess}>{successMsg}</div>}

      <div className={styles.actions}>
        <Link to={cancelTo} className={styles.cancelBtn}>
          Cancel
        </Link>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting || uploading}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
