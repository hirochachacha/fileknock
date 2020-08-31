import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import { browser } from "webextension-polyfill-ts"
import defaultSetting from "../setting/setting.json"

const Setting = () => {
  const [setting, setSetting] = useState(null)
  const [currentSetting, setCurrentSetting] = useState(null)

  useEffect(() => {
    const f = async () => {
      const res = await browser.storage.sync.get({ setting: defaultSetting })
      if (res && res.setting) {
        setSetting(res.setting)
        setCurrentSetting(res.setting)
      }
    }
    f()
  }, [])

  const onMethodChange = (e: any) => {
    e.preventDefault()
    setSetting((setting) => ({ ...setting, useGET: e.target.checked }))
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    await browser.storage.sync.set({ setting })
    setCurrentSetting(setting)
  }

  if (!setting) {
    return null
  }

  const disabled = JSON.stringify(setting) === JSON.stringify(currentSetting)

  return (
    <section className="w-full">
      <form className="p-2" onSubmit={onSubmit}>
        <div className="flex flex-col">
          <div className="mx-auto">
            <label className="my-1 inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={setting.useGET}
                onChange={onMethodChange}
              />
              <span className="ml-2">use GET method</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={disabled}
            className={`mt-2 text-base w-auto px-2 rounded mx-auto bg-blue-500 hover:bg-blue-700 text-white ${
              (disabled && "cursor-not-allowed opacity-50") || ""
            }`}
          >
            save
          </button>
        </div>
      </form>
    </section>
  )
}

export default Setting
