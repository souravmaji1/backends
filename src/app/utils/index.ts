function resolvePhoto(photo: string) {
  return photo ? process.env.NEXT_PUBLIC_API_URL + (photo.startsWith('.') ? photo.slice(1) : photo) : photo
}

export { resolvePhoto }