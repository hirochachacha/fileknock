// import "crx-hotreload"
import { browser } from "webextension-polyfill-ts"
import * as types from "./types"
import defaultSetting from "./setting/setting.json"

const countSiteInfo = (siteInfo: types.SiteInfo) => {
  let count = 0
  let hasValue = false
  for (const category of siteInfo) {
    count += category.files.filter(
      (file) =>
        200 <= file.status &&
        file.status < 300 &&
        file.contentType &&
        file.contentType !== "text/html"
    ).length
    hasValue = true
  }
  if (!hasValue) {
    return ""
  }
  return count
}

const main = async () => {
  browser.runtime.onMessage.addListener((req) => {
    const f = async () => {
      const now = Date.now()

      const target = req.target

      const { setting } = await browser.storage.sync.get({
        setting: defaultSetting,
      })

      const { [target]: siteInfo } = await browser.storage.local.get(target)

      for (const category of siteInfo) {
        if (category.updatedAt === 0) {
          for (const file of category.files) {
            const url = `${target}${file.name}`
            try {
              const res = await fetch(url, {
                method: setting.useGET ? "GET" : "HEAD",
              })
              if (res.redirected) {
                file.status = 300 // there're no way to detect exact status code for redirection.
              } else {
                file.status = res.status
              }
              file.contentType = res.headers
                .get("Content-Type")
                .split(";")[0]
                .trim()
            } catch (e) {
              // skip
            }
            await browser.storage.local.set({ [target]: siteInfo })
          }

          category.updatedAt = now

          await browser.storage.local.set({ [target]: siteInfo })
        }
      }
    }

    f()
  })
  browser.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName === "sync") {
      return
    }

    for (const item of Object.keys(changes)) {
      const match = /https?:\/\/.+?\//.exec(item)
      if (match) {
        const siteInfo: types.SiteInfo = changes[item].newValue
        const text = countSiteInfo(siteInfo).toString()
        const tabs = await browser.tabs.query({ url: `${item}*` })
        for (const tab of tabs) {
          await browser.browserAction.setBadgeText({ tabId: tab.id, text })
        }
      }
    }
  })
  browser.webNavigation.onCompleted.addListener(
    async ({ tabId, url, frameId }) => {
      if (frameId !== 0) {
        return
      }

      await browser.browserAction.setBadgeText({ tabId, text: "" })

      const match = /https?:\/\/.+?\//.exec(url)
      if (match) {
        const { [match[0]]: siteInfo } = await browser.storage.local.get(
          match[0]
        )
        if (siteInfo) {
          const text = countSiteInfo(siteInfo).toString()
          await browser.browserAction.setBadgeText({ tabId, text })
        }
      }
    }
  )
}

main()
