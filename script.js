const scrapeButton = document.getElementById("scrape-button");

// background.js..............................
// handler to recieve profile data passed by content script.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.runtime.onMessage.removeListener();
  // get profile data
  if (request.profileData) {
    let data = JSON.stringify(request.profileData);

    // dowloading as json data
    let blob = new Blob([data], { type: "application/json;charset=utf-8" });
    let objectURL = URL.createObjectURL(blob);
    chrome.downloads.download({
      url: objectURL,
      filename: "content/data.json",
      conflictAction: "overwrite",
    });

    return;
  }

  alert("Please make sure you are on a twitter user's profile page.");
});

// popup.js..................................................
// scrapeButton click event listener
scrapeButton.addEventListener("click", async () => {
  // get the current active tab
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  // execute script to extract profile data.
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapeProfileData,
  });
});

// function/content-script that will run on the webpage to extract profile data

function scrapeProfileData() {
  const mainContainerDiv = document.getElementsByClassName(
    "css-1dbjc4n r-1ifxtd0 r-ymttw5 r-ttdzmv"
  )[0];

  // accurate
  const profileName = mainContainerDiv
    .getElementsByClassName(
      "css-901oao r-1awozwy r-18jsvk2 r-6koalj r-37j5jr r-adyw6z r-1vr29t4 r-135wba7 r-bcqeeo r-1udh08x r-qvutc0"
    )[0]
    .getElementsByTagName("span")[0]?.innerText;

  //accurate
  const profileId = mainContainerDiv.getElementsByClassName(
    "css-1dbjc4n r-1awozwy r-18u37iz r-1wbh5a2"
  )[0]?.innerText;

  //accurate
  let twitterUrl = `https://twitter.com/${profileId}`;

  //accurate
  const following = mainContainerDiv
    .getElementsByClassName("css-1dbjc4n r-13awgt0 r-18u37iz r-1w6e6rj")[0]
    .getElementsByClassName(
      "css-901oao css-16my406 r-18jsvk2 r-poiln3 r-1b43r93 r-b88u0q r-1cwl3u0 r-bcqeeo r-qvutc0"
    )[0]?.innerText;

  //accurate
  const followers = mainContainerDiv
    .getElementsByClassName("css-1dbjc4n r-13awgt0 r-18u37iz r-1w6e6rj")[0]
    .getElementsByClassName(
      "css-901oao css-16my406 r-18jsvk2 r-poiln3 r-1b43r93 r-b88u0q r-1cwl3u0 r-bcqeeo r-qvutc0"
    )[1]?.innerText;

  //accurate
  const profileBio = mainContainerDiv.getElementsByClassName("css-1dbjc4n r-1adg3ll r-6gpygo")[1]
    ?.innerText;

  //accurate
  const locationName = mainContainerDiv
    .getElementsByClassName("css-1dbjc4n r-1adg3ll r-6gpygo")[2]
    .getElementsByClassName(
      "css-901oao r-18jsvk2 r-37j5jr r-a023e6 r-16dba41 r-56xrmm r-bcqeeo r-qvutc0"
    )[0]
    .querySelector("span[data-testid=UserLocation]")?.innerText;

  console.log(locationName);

  // accurate
  const companyDomain = mainContainerDiv
    .getElementsByClassName("css-1dbjc4n r-1adg3ll r-6gpygo")[2]
    .getElementsByTagName("a")[0]?.href;

  //accurate
  const profileImageUrl = mainContainerDiv
    .getElementsByClassName("css-1dbjc4n r-1adg3ll r-6gpygo")[0]
    .getElementsByTagName("img")[0].src;

  const np = "Not provided";
  const profileData = {
    profile_image_url: profileImageUrl ? profileImageUrl : np,
    profile_name: profileName ? profileName : np,
    profile_id: profileId,
    following_counter: following,
    followers_counter: followers,
    company_domain: companyDomain ? companyDomain : np,
    location_name: locationName ? locationName : np,
    profile_bio: profileBio ? profileBio : np,
    twitter_url: twitterUrl,
  };

  console.log(profileData);

  // send profile data to popup
  chrome.runtime.sendMessage({ profileData });
}
