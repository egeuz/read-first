const clickBuffer = document.createElement("div")
clickBuffer.innerHTML = "READ THE ARTICLE FIRST"
clickBuffer.id = "click-buffer"
clickBuffer.style.backgroundColor = "#111"
clickBuffer.style.width = "240px"
// clickBuffer.style.height = "50px"
clickBuffer.style.position = "fixed"
clickBuffer.style.top = 0
clickBuffer.style.left = 0
clickBuffer.style.display = "none"
clickBuffer.style.fontFamily = "sans-serif"
clickBuffer.style.fontSize = "1rem"
clickBuffer.style.fontWeight = "800"
clickBuffer.style.textAlign = "center"
clickBuffer.style.color = "#fafafa"
clickBuffer.style.padding = "10px";
document.body.appendChild(clickBuffer)

window.addEventListener("mousemove", (event) => {

  clickBuffer.style.top = `${event.clientY + 20}px`
  clickBuffer.style.left = `${event.clientX + 20}px`

  const IZMarker = "data-visualcompletion"
  const interactionZone = findParentWithAttribute(event.target, IZMarker)
  if (!interactionZone) {
    console.log("user did not click on comment area")
    clickBuffer.style.display = "none"
    return;
  }
  const ArticleVerification = verifyPostIsArticle(interactionZone)
  const IZVerification = verifyInteractionZone(interactionZone)

  if (IZVerification && ArticleVerification) {
    console.log("hey")
    clickBuffer.style.display = "block"

  //   const url = findArticleURL(interactionZone)
  //   chrome.runtime.sendMessage({ url }, response =>
  //     console.log("tab successfully opened")
  //   )
  } else {
    clickBuffer.style.display = "none"
  }

})


window.addEventListener("click", function (event) {
  console.log("i happen")
  event.preventDefault()

  const IZMarker = "data-visualcompletion"
  const interactionZone = findParentWithAttribute(event.target, IZMarker)
  if (!interactionZone) {
    console.log("user did not click on comment area")
    return;
  }
  const IZVerification = verifyInteractionZone(interactionZone)

  if (IZVerification) {
    const url = findArticleURL(interactionZone)
    chrome.runtime.sendMessage({ url }, response =>
      console.log("tab successfully opened")
    )
  }
})

//recursively travel through event target's parent nodes
function findParentWithAttribute(node, attribute) {
  if (node === document) {
    return false; //if you hit the top of the document, stop
  } else {
    if (node.getAttribute(attribute)) {
      return node //if it has the marker attribute, return it!
    } else {
      //otherwise, go one step up the DOM and try again
      return findParentWithAttribute(node.parentNode, attribute)
    }
  }
}

function verifyInteractionZone(node) {
  let shareButton = node.querySelector('[aria-label="Send this to friends or post it on your timeline."]')
  if (shareButton) {
    return true;
  } else {
    return false;
  }
}

function verifyPostIsArticle(node) {
  const parentPost = findParentWithAttribute(node, "data-pagelet")
  let isArticle = parentPost.querySelector('[aria-label="More"]:not([aria-haspopup="menu"])')
  return isArticle ? true : false
}

function findArticleURL(node) {
  const parentPost = findParentWithAttribute(node, "data-pagelet")
  const url = parentPost.querySelector('[role="link"][target="_blank"]')
  return url.href
}
