type ScanList = ScanCategory[]

interface ScanCategory {
  name: string
  files: string[]
  default: boolean
}

type SiteInfo = SiteCategory[]

interface SiteCategory {
  target: string
  name: string
  files: {
    name: string
    status?: number
    contentType?: string
  }[]
  updatedAt: number // ms
}

export { ScanList, SiteInfo, SiteCategory }
