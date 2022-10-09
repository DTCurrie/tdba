export const screenSize = () => ({
  width: () => window.innerWidth,
  height: () => window.innerHeight,
  halfWidth: () => window.innerWidth / 2,
  halfHeight: () => window.innerHeight / 2,
  aspect: () => window.innerWidth / window.innerHeight,
});
