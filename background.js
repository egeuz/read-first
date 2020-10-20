chrome.runtime.onMessage.addListener(
  function(request, sender, response) {
    chrome.tabs.create({
      url: request.url,
      active: true
    })
  }
)