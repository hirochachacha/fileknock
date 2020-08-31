import { h } from "preact"
import { useState, useContext } from "preact/hooks"
import { browser } from "webextension-polyfill-ts"
import { AppContext } from "./App"

const Link = () => {
  const { siteInfo } = useContext(AppContext)

  const [_2xx, set2xx] = useState(true)
  const [_3xx, set3xx] = useState(false)
  const [_4xx, set4xx] = useState(false)
  const [_5xx, set5xx] = useState(false)

  const [html, setHtml] = useState(false)
  const [text, setTxt] = useState(true)
  const [xml, setXml] = useState(true)
  const [json, setJson] = useState(true)
  const [other, setOther] = useState(true)

  const statusOk = (status?: number) => {
    if (200 <= status && status < 300) {
      return _2xx
    } else if (status < 400) {
      return _3xx
    } else if (status < 500) {
      return _4xx
    } else if (status < 600) {
      return _5xx
    }
    return false
  }

  const mimeOk = (contentType?: string) => {
    if (!contentType) {
      return false
    }
    switch (contentType) {
      case "text/html":
        return html
      case "text/plain":
        return text
      case "text/xml":
        return xml
      case "application/xml":
        return xml
      case "application/json":
        return json
      default:
        return other
    }
  }

  const tables = siteInfo.map((category, i) => {
    const tableRows = category.files
      .filter((file) => statusOk(file.status) && mimeOk(file.contentType))
      .map((file) => {
        const onClick = async () => {
          await browser.tabs.create({ url: `${category.target}${file.name}` })
        }

        return (
          <tr
            key={`${i}-${file.name}`}
            className="border hover:bg-gray-300"
            onClick={onClick}
          >
            <td className="px-4 py-2">{file.name}</td>
            <td className="px-4 py-2 text-right">{`(${
              file.status === 300 ? "3xx" : file.status
            })`}</td>
          </tr>
        )
      })

    return (
      <table key={i} className="w-full p-1 my-1">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">{`${category.name} (${
              category.files.filter(
                (file) => statusOk(file.status) && mimeOk(file.contentType)
              ).length
            })`}</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    )
  })

  const on2xxChange = (e: any) => {
    set2xx(() => e.target.checked)
  }

  const on3xxChange = (e: any) => {
    set3xx(() => e.target.checked)
  }

  const on4xxChange = (e: any) => {
    set4xx(() => e.target.checked)
  }

  const on5xxChange = (e: any) => {
    set5xx(() => e.target.checked)
  }

  const onHtmlChange = (e: any) => {
    setHtml(() => e.target.checked)
  }

  const onTextChange = (e: any) => {
    setTxt(() => e.target.checked)
  }

  const onXmlChange = (e: any) => {
    setXml(() => e.target.checked)
  }

  const onJsonChange = (e: any) => {
    setJson(() => e.target.checked)
  }

  const onOtherChange = (e: any) => {
    setOther(() => e.target.checked)
  }

  return (
    <section className="w-full">
      <div className="w-full my-2">
        <label className="w-1/4 inline-flex justify-center items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={_2xx}
            onChange={on2xxChange}
          />
          <span className="ml-2">2xx</span>
        </label>
        <label className="w-1/4 inline-flex justify-center items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={_3xx}
            onChange={on3xxChange}
          />
          <span className="ml-2">3xx</span>
        </label>
        <label className="w-1/4 inline-flex justify-center items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={_4xx}
            onChange={on4xxChange}
          />
          <span className="ml-2">4xx</span>
        </label>
        <label className="w-1/4 inline-flex justify-center items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={_5xx}
            onChange={on5xxChange}
          />
          <span className="ml-2">5xx</span>
        </label>
      </div>
      <div className="w-full my-2">
        <label className="w-1/5 inline-flex justify-center items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={html}
            onChange={onHtmlChange}
          />
          <span className="ml-2">html</span>
        </label>
        <label className="w-1/5 inline-flex justify-center items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={text}
            onChange={onTextChange}
          />
          <span className="ml-2">text</span>
        </label>
        <label className="w-1/5 inline-flex justify-center items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={xml}
            onChange={onXmlChange}
          />
          <span className="ml-2">xml</span>
        </label>
        <label className="w-1/5 inline-flex justify-center items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={json}
            onChange={onJsonChange}
          />
          <span className="ml-2">json</span>
        </label>
        <label className="w-1/5 inline-flex justify-center items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={other}
            onChange={onOtherChange}
          />
          <span className="ml-2">other</span>
        </label>
      </div>
      {tables}
    </section>
  )
}

export default Link
