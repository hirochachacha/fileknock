import { browser } from "webextension-polyfill-ts"
import * as types from "./types"
import defaultScanList from "./setting/scan_list.json"

const makeSiteInfo = async (target: string, selected: boolean[]) => {
  const siteInfo: types.SiteInfo = []
  const { scanList } = await browser.storage.sync.get({
    scanList: defaultScanList,
  })
  for (let i = 0; i < scanList.length; i++) {
    const category = scanList[i]
    if (selected[i]) {
      siteInfo.push({
        target,
        name: category.name,
        files: category.files.map((name) => ({ name })),
        updatedAt: 0,
      })
    }
  }
  return siteInfo
}

export { makeSiteInfo }
