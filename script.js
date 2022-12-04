const scrapeButton = document.getElementById("scrape-button");

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

// function to extract profile data

function scrapeProfileData() {
  const profileName = document.getElementsByClassName(
    "css-901oao r-1awozwy r-18jsvk2 r-6koalj r-37j5jr r-adyw6z r-1vr29t4 r-135wba7 r-bcqeeo r-1udh08x r-qvutc0"
  )[0].innerText;

  const profileId = document.getElementsByClassName(
    "css-901oao css-1hf3ou5 r-14j79pv r-18u37iz r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"
  )[0]?.innerText;

  let twitterUrl = `https://twitter.com/${profileId}`;

  const following = document.getElementsByClassName(
    "css-901oao css-16my406 r-18jsvk2 r-poiln3 r-1b43r93 r-b88u0q r-1cwl3u0 r-bcqeeo r-qvutc0"
  )[0]?.innerText;

  const followers = document.getElementsByClassName(
    "css-901oao css-16my406 r-18jsvk2 r-poiln3 r-1b43r93 r-b88u0q r-1cwl3u0 r-bcqeeo r-qvutc0"
  )[1]?.innerText;

  const profileBio = document.getElementsByClassName(
    "css-901oao r-18jsvk2 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"
  )[1]?.innerText;

  const locationName = document.getElementsByClassName(
    "css-901oao css-16my406 r-4qtqp9 r-poiln3 r-1b7u577 r-bcqeeo r-qvutc0"
  )[0]?.innerText;

  const companyDomain = document.getElementsByClassName(
    "css-4rbku5 css-18t94o4 css-901oao css-16my406 r-1cvl2hr r-1loqt21 r-4qtqp9 r-poiln3 r-1b7u577 r-bcqeeo r-qvutc0"
  )[0]?.innerText;

  let profileImageUrl;

  const scriptData = document.getElementsByTagName("script")[1]?.innerText;

  if (scriptData) {
    const data = JSON.parse(scriptData);
    profileImageUrl = data.author.image.contentUrl;
  }

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
}
