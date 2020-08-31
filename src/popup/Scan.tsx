import { h } from "preact"
import { useState, useEffect, useContext } from "preact/hooks"
import { browser } from "webextension-polyfill-ts"
import defaultScanList from "../setting/scan_list.json"
import { makeSiteInfo } from "../utils"
import { AppContext } from "./App"

const Scan = ({ setPage }: { setPage: any }) => {
  const { target } = useContext(AppContext)
  const [scanList, setScanList] = useState([])
  const [checked, setChecked] = useState([])

  useEffect(() => {
    const f = async () => {
      const { scanList } = await browser.storage.sync.get({
        scanList: defaultScanList,
      })
      setScanList(scanList)
      setChecked(scanList.map((e) => e.default))
    }
    f()
  }, [])

  const inputs = scanList.map((e, i) => {
    const onChange = (e: any) => {
      setChecked((checked) => {
        const checked1 = [...checked]
        checked1[i] = e.target.checked
        return checked1
      })
    }

    return (
      <label key={i} className="my-1 inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox"
          checked={checked[i]}
          onChange={onChange}
        />
        <span className="ml-2">{e.name}</span>
      </label>
    )
  })

  const onSubmit = async (e: any) => {
    e.preventDefault()
    await browser.storage.local.set({
      [target]: await makeSiteInfo(target, checked),
    })
    await browser.runtime.sendMessage({ target })
    setPage("Link")
  }

  const disabled = !target

  return (
    <section className="w-full">
      <form className="p-2" onSubmit={onSubmit}>
        <div className="flex flex-col">
          <div className="mx-auto flex flex-col">{inputs}</div>
          <button
            type="submit"
            disabled={disabled}
            className={`mt-2 text-base w-auto px-2 rounded mx-auto bg-blue-500 hover:bg-blue-700 text-white ${
              (disabled && "cursor-not-allowed opacity-50") || ""
            }`}
          >
            scan
          </button>
        </div>
      </form>
    </section>
  )
}

export default Scan
