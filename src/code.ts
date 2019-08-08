figma.showUI(__html__, {width: 220, height: 190})

function oneLayerCheck() {
  if (figma.currentPage.selection.length > 1) {
    figma.closePlugin("You can only choose one layer.")
  } else if (figma.currentPage.selection.length == 0) {
    figma.closePlugin("Choose one layer.")
  } else {
    return true
  }
}

figma.ui.onmessage = msg => {
  if ((msg.type === 'isometric-left' || msg.type === 'isometric-right') && oneLayerCheck()) {
    const nodes = []

    for (const node of figma.currentPage.selection) {
      const xC = node.x + node.width / 2
      const yC = node.y + node.height / 2

      if (msg.type === 'isometric-left') {
        const xyPos = rotate(xC, yC, node.x, node.y, msg.angle)
        node.x = xyPos[0]
        node.y = xyPos[1]
        node.rotation += msg.angle
      } else if (msg.type === 'isometric-right') {
        const xyPos = rotate(xC, yC, node.x, node.y, -msg.angle)
        node.x = xyPos[0]
        node.y = xyPos[1]
        node.rotation -= msg.angle
      }

      const selection = figma.currentPage.selection

      if (selection.length > 0) {
        const parent = selection[0].parent
        const newGroup = figma.group(figma.currentPage.selection, parent)
        newGroup.resize(newGroup.width, newGroup.height * 0.5773)
        newGroup.y = yC - newGroup.height * 0.5773
      }
    }
    figma.currentPage.selection = nodes
    figma.viewport.scrollAndZoomIntoView(nodes)
  } 
  //figma.closePlugin()
}
function rotate(cx, cy, x, y, angle) {
  var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  return [nx, ny];
}