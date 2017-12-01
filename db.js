module.exports = () => {
  return {
    home: getHome()
  }
}

function getHome() {
  const items = []
  for (let i = 0; i < 5; i++) {
    items.push({
      id: i
    })
  }
  return items
}
