export const concatUrl = (...parts: string[]) => {
  const url = parts
    .map((part, i) => {
      let croppedPart = part;

      if (i !== 0 && croppedPart[0] === '/') {
        croppedPart = croppedPart.slice(1);
      }
      if (i + 1 !== parts.length && croppedPart.at(-1) === '/') {
        croppedPart = croppedPart.slice(0, -1);
      }
      return croppedPart;
    })
    .join('/');

  return url;
};
