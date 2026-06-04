const entry = __TREE_SHAKE_ENTRY__

if (entry === 'main-subpath.tsx') {
  await import('./main-subpath')
} else {
  await import('./main-root')
}
