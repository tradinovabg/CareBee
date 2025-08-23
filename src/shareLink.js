export async function shareLink(nav, link, t) {
  try {
    if (nav.share) {
      await nav.share({
        title: 'CareBee',
        text: t('shareText', 'Quick help at your fingertips'),
        url: link,
      })
      return { msg: '', manual: false }
    }
    if (nav.clipboard?.writeText) {
      await nav.clipboard.writeText(link)
      return { msg: t('linkCopied', 'Link copied'), manual: false }
    }
    return { msg: t('manualCopy', `Copy the link manually: ${link}`), manual: true }
  } catch {
    return { msg: t('linkCopyFailed', 'Could not share'), manual: false }
  }
}
