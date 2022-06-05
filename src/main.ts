
async function main() {
  const [{ bootstrap }] = await Promise.all([
    import('./bootstrap'),
    import('./app.config'),
  ])
  bootstrap()
}
main();
