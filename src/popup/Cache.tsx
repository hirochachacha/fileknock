import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import { browser } from "webextension-polyfill-ts"

const Cache = () => {
  const [cache, setCache] = useState({})

  useEffect(() => {
    const f = async () => {
      setCache(await browser.storage.local.get())
    }
    f()
  }, [])

  const tableRows = Object.keys(cache).map((target) => {
    const onClick = async () => {
      await browser.storage.local.remove(target)
      setCache((cache) => {
        const cache1 = { ...cache }
        delete cache1[target]
        return cache1
      })
    }

    return (
      <tr key={target} className="border hover:bg-gray-300" onClick={onClick}>
        <td className="px-4 py-2">{target}</td>
      </tr>
    )
  })

  const onClick = async () => {
    await browser.storage.local.clear()
    setCache({})
  }

  const disabled = Object.keys(cache).length === 0

  return (
    <section className="w-full">
      <table className="w-full p-1 my-1">
        <tbody>{tableRows}</tbody>
      </table>
      <div className="w-full flex">
        <button
          disabled={disabled}
          className={`my-2 text-base w-auto px-2 rounded mx-auto bg-blue-500 hover:bg-blue-700 text-white ${
            (disabled && "cursor-not-allowed opacity-50") || ""
          }`}
          onClick={onClick}
        >
          clear
        </button>
      </div>
    </section>
  )
}

export default Cache
