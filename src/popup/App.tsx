import { h, createContext } from "preact"
import { useState, useEffect } from "preact/hooks"
import { browser } from "webextension-polyfill-ts"
import * as types from "../types"
import Link from "./Link"
import Scan from "./Scan"
import Cache from "./Cache"
import Setting from "./Setting"

const AppContext = createContext(null)

const AppProvider = ({
  setPage,
  children,
}: {
  setPage: any
  children: any
}) => {
  const [target, setTarget] = useState("")
  const [siteInfo, setSiteInfo] = useState<types.SiteInfo>([])

  useEffect(() => {
    const f = async () => {
      const tabs = await browser.tabs.query({
        active: true,
        lastFocusedWindow: true,
      })
      const match = /https?:\/\/.+?\//.exec(tabs[0].url)
      if (match) {
        setTarget(match[0])
      }
    }
    f()
  }, [])

  useEffect(() => {
    const onStorageChanged = async (changes, areaName) => {
      if (areaName === "sync") {
        return
      }

      for (const item of Object.keys(changes)) {
        if (item === target) {
          setSiteInfo(changes[item].newValue)
        }
      }
    }

    const f = async () => {
      if (target) {
        const { [target]: siteInfo } = await browser.storage.local.get(target)
        if (siteInfo && siteInfo.length) {
          setSiteInfo(siteInfo)
          setPage("Link")
        }

        browser.storage.onChanged.addListener(onStorageChanged)
      }
    }

    f()

    return () => {
      if (target) {
        browser.storage.onChanged.removeListener(onStorageChanged)
      }
    }
  }, [target, setPage])

  return (
    <AppContext.Provider value={{ target, siteInfo }}>
      {children}
    </AppContext.Provider>
  )
}

const App = () => {
  const [page, setPage] = useState("Scan")

  const Page = () => {
    switch (page) {
      case "Scan":
        return <Scan setPage={setPage} />
      case "Link":
        return <Link />
      case "Cache":
        return <Cache />
      case "Setting":
        return <Setting />
      default:
        return null
    }
  }

  const Navigation = () => {
    const onScanLinkClick = (e: any) => {
      e.preventDefault()
      setPage("Scan")
    }

    const onLinkLinkClick = (e: any) => {
      e.preventDefault()
      setPage("Link")
    }

    const onCacheLinkClick = (e: any) => {
      e.preventDefault()
      setPage("Cache")
    }

    const onSettingLinkClick = (e: any) => {
      e.preventDefault()
      setPage("Setting")
    }

    return (
      <nav className="w-full">
        <ul className="flex p-1 my-1">
          <li
            className={`w-1/4 text-center hover:bg-gray-300 ${
              (page === "Scan" && "bg-gray-200") || ""
            }`}
          >
            <a href="#" onClick={onScanLinkClick}>
              <svg
                className="w-8 h-8 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
                />
              </svg>
              <span>Scan</span>
            </a>
          </li>
          <li
            className={`w-1/4 text-center hover:bg-gray-300 ${
              (page === "Link" && "bg-gray-200") || ""
            }`}
          >
            <a href="#" onClick={onLinkLinkClick}>
              <svg
                className="w-8 h-8 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <span>Link</span>
            </a>
          </li>
          <li
            className={`w-1/4 text-center hover:bg-gray-300 ${
              (page === "Cache" && "bg-gray-200") || ""
            }`}
          >
            <a href="#" onClick={onCacheLinkClick}>
              <svg
                className="w-8 h-8 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                />
              </svg>
              <span>Cache</span>
            </a>
          </li>
          <li
            className={`w-1/4 text-center hover:bg-gray-300 ${
              (page === "Setting" && "bg-gray-200") || ""
            }`}
          >
            <a href="#" onClick={onSettingLinkClick}>
              <svg
                className="w-8 h-8 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Setting</span>
            </a>
          </li>
        </ul>
      </nav>
    )
  }

  return (
    <AppProvider setPage={setPage}>
      <div className="w-full p-1 divide-y divide-gray-400">
        <Navigation />
        <Page />
      </div>
    </AppProvider>
  )
}

export { AppContext }

export default App
